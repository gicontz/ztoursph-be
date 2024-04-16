import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { UsersService } from 'src/users/users.service';
import {
  TCheckout,
  TCheckoutPaymentStatus,
  TPayment,
  TPaymentType,
} from './checkout.model';
import { BookingsService } from 'src/bookings/bookings.service';
import { PaymentStatus } from 'src/bookings/bookings.model';
import { MayaService } from 'src/third-party/maya-sdk/maya.service';
import { CheckoutService } from './checkout.service';
import { PAYMENT_DTO_EXAMPLE, TPaymentDTO, TPreCheckout } from './checkout.dto';
import {
  TPaymentResponse,
  TPaymentStatus,
} from 'src/third-party/maya-sdk/maya.dto';
import { Response } from 'express';
import { ToursService } from 'src/tours/tours.service';
import { PackagesService } from 'src/packages/packages.service';
import config from '../config/config';
import { format } from 'date-fns';
import { uuidTo8Bits } from 'src/utils/hash';
import { S3BucketService } from 'src/middlewares/s3.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
import { PdfService } from 'src/pdf/pdf.service';
import { NameSuffix, TPDFItenerary } from 'src/pdf/pdf.dto';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly userService: UsersService,
    private readonly mayaService: MayaService,
    private readonly bookingService: BookingsService,
    private readonly toursService: ToursService,
    private readonly packageService: PackagesService,
    private readonly checkoutService: CheckoutService,
    private readonly s3Service: S3BucketService,
    private readonly s3ServiceMiddleware: S3Service,
    private readonly generateItinerary: PdfService,
  ) {}

  private cnfg = config();

  async calculateTotalAmts(data: TPreCheckout): Promise<any> {
    const { booking } = data;
    const ids = booking.map((b) => b.id);

    const tours = await this.toursService.findByIds(ids as number[]);
    const packages = await this.packageService.findByIds(ids as string[]);
    const trips: Array<{
      id: string | number;
      price: number;
      per_pax_price: number;
      min_pax: number;
      discount: number;
      pax: number;
      ages: number[];
    }> = [
      ...tours.map(({ id, price, discount, min_pax, per_pax_price }) => ({
        id,
        price,
        min_pax,
        per_pax_price,
        discount,
        pax: booking.find((b) => b.id === id).pax,
        ages: booking.find((b) => b.id === id).ages,
      })),
      ...packages.map(({ id, price, discount, min_pax, per_pax_price }) => ({
        id,
        price,
        min_pax,
        per_pax_price,
        discount,
        pax: booking.find((b) => b.id === id).pax,
        ages: booking.find((b) => b.id === id).ages,
      })),
    ];

    const getSubTotal = (prices: {
      price: number;
      pax: number;
      discount: number;
      min_pax: number;
      per_pax_price: number;
      ages: number[];
    }) => {
      const { price, pax, discount, min_pax, per_pax_price, ages } = prices;
      const discountedPrice = price - price * (discount / 100);
      const floatPax = ages.reduce((acc, curr) => {
        if (curr <= 3)
          return acc - (1 - this.cnfg.payments.discounts.kidsUnderFour / 100);
        if (curr < 7)
          return acc - (1 - this.cnfg.payments.discounts.kidsUnderSeven / 100);
        return acc;
      }, pax);
      if (min_pax > 1) {
        const additionalPax = floatPax - min_pax;
        return discountedPrice + additionalPax * per_pax_price;
      }
      return discountedPrice * floatPax;
    };

    const subTotals = trips.map((t) => {
      const { id, price, min_pax, per_pax_price, discount, ages, pax } = t;
      return {
        id,
        pax,
        subTotal: getSubTotal({
          price,
          pax,
          discount,
          min_pax,
          per_pax_price,
          ages,
        }),
      };
    });

    const totalAmt = subTotals.reduce((acc, curr) => acc + curr.subTotal, 0);

    const processingFee =
      totalAmt * (this.cnfg.payments.processingFeeRates / 100) +
      this.cnfg.payments.processingFee;

    const totalAmtTbp = totalAmt + processingFee;

    return {
      subTotals,
      totalAmt,
      processingFee,
      totalAmtTbp,
    };
  }

  @Post('/trips')
  @ApiBody({
    required: true,
    examples: {
      example1: {
        summary: 'Checkout Data Example',
        value: {
          userEmail: 'test@test.com',
          first_name: 'John',
          middle_init: 'D',
          last_name: 'Doe',
          packages: [
            {
              id: 1,
              pax: 1,
              date: '2022-12-12',
              participants: [
                {
                  name: 'Jane Doe',
                  age: 20,
                  nationality: 'Filipino',
                },
              ],
            },
          ],
        },
      },
    },
  })
  async checkoutTrips(@Body() data: TCheckout): Promise<TResponseData> {
    // Check if user exists
    let userInfo = await this.userService.findOne({
      id: data.userId,
      email: data.userEmail,
    });

    if (!userInfo) {
      // Create the user if not exists
      const newUserData = {
        email: data.userEmail,
        first_name: data.first_name,
        middle_init: data.middle_init,
        last_name: data.last_name,
        mobile_number1: data.mobile_number1,
        mobile_number2: data.mobile_number2,
        birthday: data.birthday,
        nationality: data.nationality,
        sex: data.sex,
      };
      userInfo = await this.userService.create(newUserData);
    }
    // Upon user verification, create booking
    const { packages } = data;
    const totalAmts = await this.calculateTotalAmts({
      booking: packages.map((p) => ({
        id: p.id,
        pax: p.pax,
        ages: p.participants.map((a) => a.age),
      })),
    });

    const bookingInfo = {
      packages: packages as any,
      total_amt: totalAmts.totalAmt,
      user_id: userInfo.id,
      paymentStatus: PaymentStatus.UNPAID,
      reference_id: uuidTo8Bits(),
    };

    const guestsPerTour = packages.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr.participants.map((p) => ({
          id: uuidTo8Bits(),
          name: p.name,
          age: p.age,
          nationality: p.nationality,
        })),
      };
    }, {});

    const pdfData: TPDFItenerary = {
      referenceNumber: bookingInfo.reference_id,
      firstName: userInfo.first_name,
      middleInitial: userInfo.middle_init,
      lastName: userInfo.last_name,
      suffix: NameSuffix.None,
      birthday: userInfo.birthday as unknown as string,
      email: userInfo.email,
      mobileNumber1: userInfo.mobile_number1,
      mobileNumber2: userInfo.mobile_number2,
      booking_date: new Date().toISOString(),
      guests: guestsPerTour,
      booked_tours: packages as any,
      nationality: userInfo.nationality,
    };

    // Return as object and generate the buffer
    const itineraryFileName = `${
      bookingInfo.reference_id
    }_itinerary_${new Date().toISOString()}.pdf`;
    const itinerary = await this.generateItinerary.generateItenerary(
      pdfData,
      itineraryFileName,
    );

    // Upload the itinerary to s3bucket
    await this.s3ServiceMiddleware.uploadFiles([itinerary]);

    // Create a uri to that specific s3 file
    const itineraryFileUri = await this.s3Service.getPDF(itineraryFileName);

    const newBooking = await this.bookingService.create({
      ...bookingInfo,
      itinerary: itineraryFileName,
    });

    return {
      status: HttpStatus.ACCEPTED,
      message: 'Trips Checkout Successfully!',
      data: {
        ...newBooking,
        user: userInfo,
        itineraryFileUri,
      },
    };
  }

  @Post('/payment')
  @ApiBody({
    required: true,
    description: 'This is an example of the payment data',
    type: TPaymentDTO,
    examples: {
      example1: {
        summary: 'Payment Data Example',
        value: PAYMENT_DTO_EXAMPLE,
      },
    },
  })
  async checkoutPayment(
    @Body('paymentData') paymentData: TPayment,
  ): Promise<TResponseData> {
    // Check Booking If Exists
    try {
      const bookingInfo = await this.bookingService.findOne(
        paymentData.bookingId,
      );
      const userId = bookingInfo.user_id;
      paymentData.userId = userId;
      // Checkout Payment if Booking Exists
      if (bookingInfo.paymentStatus === PaymentStatus.PAID) {
        return {
          status: HttpStatus.OK,
          message: 'You already paid for this booking. Thank you!',
        };
      }
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Booking Info not found',
      };
    }

    try {
      const paymentInfo = await this.checkoutService.create(paymentData);
      const referenceId = paymentInfo.referenceId;
      const userInfo = await this.userService.findOne({
        id: paymentData.userId,
      });
      if (paymentData) {
        const data = await this.mayaService.checkout({
          totalAmount: {
            value: paymentData.amount,
            currency: 'PHP',
          },
          buyer: {
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            middleName: userInfo.middle_init,
            birthday: format(userInfo.birthday, 'yyyy-MM-dd'),
            customerSince: format(userInfo.created_date, 'yyyy-MM-dd'),
            sex: userInfo.sex,
            contact: {
              phone: userInfo.mobile_number1,
              email: userInfo.email,
            },
          },
          redirectUrl: paymentData.redirectUrl,
          requestReferenceNumber: referenceId,
        });
        return data;
      }
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Payment Data is required',
      };
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error in processing payment: CODE - ${e}`,
      };
    }
  }

  @Post('/verify')
  @ApiBody({
    required: true,
    description:
      'A webhook for payment process of maya, consumes PAYMENT_SUCCESS, PAYMENT_FAILED, PAYMENT_EXPIRED, PAYMENT_CANCELLED, and AUTHORIZED',
  })
  async verifyPayment(
    @Body() paymentResponse: TPaymentResponse,
    @Res() response: Response,
  ): Promise<Response<TResponseData>> {
    const status = this.mayaService.verifyPayment(paymentResponse);
    let bookingId = '';

    // Log Payment Response
    await this.checkoutService.log({
      reference_id: paymentResponse.requestReferenceNumber,
      logs: JSON.stringify(paymentResponse),
    });

    try {
      bookingId = (
        await this.checkoutService.findOne(
          paymentResponse.requestReferenceNumber,
        )
      )?.bookingId;
      if (!bookingId)
        return response.status(HttpStatus.OK).send({
          status: HttpStatus.OK,
          message: 'Booking Info not found. Check your reference number.',
        });
    } catch (e) {
      console.warn(new Date(), e);
      return response.status(HttpStatus.OK).send({
        status: HttpStatus.OK,
        message: 'Booking Info not found. Check your reference number.',
      });
    }

    switch (status) {
      case TPaymentStatus.SUCCESS: {
        try {
          const paymentInfo = await this.checkoutService.update({
            referenceId: paymentResponse.requestReferenceNumber,
            status: TCheckoutPaymentStatus.SUCCESS,
            updatedAt: new Date(),
            receiptNumber: paymentResponse.receiptNumber,
            paymentType:
              paymentResponse.fundSource.type === 'card'
                ? TPaymentType.CREDIT_CARD
                : TPaymentType.E_WALLET,
            success_response: JSON.stringify(paymentResponse),
          });
          // Update Booking Payment Status
          await this.bookingService.update({
            id: bookingId,
            paymentStatus: PaymentStatus.PAID,
            approval_code: paymentResponse.approvalCode,
          });
          delete paymentInfo.success_response;
          return response.status(HttpStatus.OK).send({
            status: HttpStatus.OK,
            message: 'Payment has been verified',
            data: paymentInfo,
          });
        } catch (e) {
          console.warn(new Date(), e);
          return response.status(HttpStatus.OK).send({
            status: HttpStatus.OK,
            message: 'Payment stuck while verifying. Please contact support.',
            data: {
              status: paymentResponse.status,
              receiptNumber: paymentResponse.receiptNumber,
              errorMessage: e.detail,
            },
          });
        }
      }
      case TPaymentStatus.AUTHORIZED: {
        try {
          const paymentInfo = await this.checkoutService.update({
            referenceId: paymentResponse.requestReferenceNumber,
            status: TCheckoutPaymentStatus.PENDING,
            updatedAt: new Date(),
            receiptNumber: paymentResponse.receiptNumber,
            success_response: JSON.stringify(paymentResponse),
          });
          delete paymentInfo.success_response;
          return response.status(HttpStatus.OK).send({
            status: HttpStatus.OK,
            message:
              'Payment process is still pending. Please wait for the payment to be verified.',
            data: paymentInfo,
          });
        } catch (e) {
          console.warn(new Date(), e);
          return response.status(HttpStatus.OK).send({
            status: HttpStatus.OK,
            message: 'Payment stuck while verifying. Please contact support.',
            data: {
              status: paymentResponse.status,
              receiptNumber: paymentResponse.receiptNumber,
            },
          });
        }
      }
      default: {
        try {
          const paymentInfo = await this.checkoutService.update({
            referenceId: paymentResponse.requestReferenceNumber,
            status: TCheckoutPaymentStatus.FAILED,
            updatedAt: new Date(),
            receiptNumber: paymentResponse.errorCode,
            paymentType:
              paymentResponse.fundSource.type === 'card'
                ? TPaymentType.CREDIT_CARD
                : TPaymentType.E_WALLET,
            failed_response: JSON.stringify(paymentResponse),
          });

          delete paymentInfo.failed_response;
          return response.status(HttpStatus.OK).send({
            status: HttpStatus.OK,
            message: 'Payment failed, cancelled or cannot be verified.',
            data: paymentInfo,
          });
        } catch (e) {
          console.warn(new Date(), e);
          return response.status(HttpStatus.OK).send({
            status: HttpStatus.OK,
            message: 'Payment has not been verified',
          });
        }
      }
    }
  }

  @Post('/calculate/trips')
  @ApiBody({
    required: true,
    type: TPreCheckout,
    examples: {
      example1: {
        summary: 'Pre Checkout Data Example',
        value: {
          booking: [
            { id: '1', pax: 1 },
            { id: '2', pax: 2 },
            { id: '3', pax: 3 },
          ],
        },
      },
    },
  })
  async calculateTrips(@Body() data: TPreCheckout): Promise<TResponseData> {
    if (!data.booking || data.booking.length === 0) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Cannot Calculate Trips!',
      };
    }

    const totals = await this.calculateTotalAmts(data);

    return {
      status: HttpStatus.OK,
      message: 'Trips Calculated Successfully!',
      data: {
        ...totals,
      },
    };
  }
}
