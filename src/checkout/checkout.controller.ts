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
      pax: number;
      discount?: number;
      min_pax?: number;
      per_pax_price?: number;
    }> = [
      ...tours.map(({ id, price, discount, min_pax, per_pax_price }) => ({
        id,
        price,
        pax: booking.find((b) => b.id === id).pax,
        discount,
        min_pax,
        per_pax_price,
      })),
      ...packages.map(({ id, price, discount, min_pax, per_pax_price }) => ({
        id,
        price,
        pax: booking.find((b) => b.id === id).pax,
        discount,
        min_pax,
        per_pax_price,
      })),
    ];

    const subTotals = trips.map((t) => {
      const { id, price, pax, discount, min_pax, per_pax_price } = t;

      const getTotal = (): number => {
        if (min_pax && min_pax >= pax) return Number(price);
        if (min_pax && min_pax < pax) {
          const extraPax = pax - min_pax;
          const addOnFees = extraPax * per_pax_price;
          return Number(price) + addOnFees;
        }

        return Number(price) * pax;
      };

      const getSubtotal = (): number => {
        if (!discount) {
          return getTotal();
        }
        return getTotal() * (1 - discount / 100);
      };

      return {
        id,
        pax,
        subTotal: parseFloat(getSubtotal().toFixed(2)),
        discount,
        total: getTotal(),
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
      booking: packages.map((p) => ({ id: p.id, pax: p.pax })),
    });
    const newBooking = await this.bookingService.create({
      packages: packages as any,
      total_amt: totalAmts.totalAmt,
      user_id: userInfo.id,
      paymentStatus: PaymentStatus.UNPAID,
      reference_id: uuidTo8Bits(),
    });

    return {
      status: HttpStatus.ACCEPTED,
      message: 'Trips Checkout Successfully!',
      data: {
        ...newBooking,
        user: userInfo,
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
            { id: '95918c0e-96e8-4d8c-b5fb-9ef03f8faed1', pax: 2 },
            { id: '69aa8814-6da4-47d7-9f8c-29554e4ddc55', pax: 2 },
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
