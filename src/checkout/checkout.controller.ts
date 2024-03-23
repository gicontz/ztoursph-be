import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { UsersService } from 'src/users/users.service';
import { TCheckout, TCheckoutPaymentStatus, TPayment, TPaymentType } from './checkout.model';
import { BookingsService } from 'src/bookings/bookings.service';
import { PaymentStatus } from 'src/bookings/bookings.model';
import { MayaService } from 'src/third-party/maya-sdk/maya.service';
import { CheckoutService } from './checkout.service';
import { PAYMENT_DTO_EXAMPLE, TPaymentDTO } from './checkout.dto';
import { TPaymentResponse, TPaymentStatus } from 'src/third-party/maya-sdk/maya.dto';
import { Response } from 'express';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
    constructor(
        private readonly userService: UsersService,
        private readonly mayaService: MayaService,
        private readonly bookingService: BookingsService,
        private readonly checkoutService: CheckoutService) {}

    @Post('/trips')
    @ApiBody({ required: true })
    async checkoutTrips(@Body('data') data: TCheckout): Promise<TResponseData> {
        // Check if user exists
        let userInfo = await this.userService.findOne({ id: data.userId, email: data.userEmail });
        if (!userInfo) {
            // Create the user if not exists
            const newUserData = {
                email: data.userEmail,
                first_name: data.first_name,
                middle_init: data.middle_init,
                last_name: data.last_name
            };
            userInfo = await this.userService.create(newUserData);
        }
        // Upon user verification, create booking
        const { packages, totalAmt } = data;
        const newBooking = await this.bookingService.create({
            packages,
            total_amt: totalAmt,
            user_id: userInfo.id,
            paymentStatus: PaymentStatus.UNPAID,
        });

        return {
            status: HttpStatus.ACCEPTED,
            message: 'Trips Checkout Successfully!',
            data: newBooking
        }
    }

    @Post('/payment')
    @ApiBody({ required: true, description: "This is an example of the payment data", type: TPaymentDTO, examples: {
        example1: {
            summary: 'Payment Data Example',
            value: PAYMENT_DTO_EXAMPLE,
        }
    } })
    async checkoutPayment(@Body('paymentData') paymentData: TPayment): Promise<TResponseData> {
        // Check Booking If Exists
        try {
            const bookingInfo = await this.bookingService.findOne(paymentData.bookingId);
            const userId = bookingInfo.user_id;
            paymentData.userId = userId;
            // Checkout Payment if Booking Exists
            if (bookingInfo.paymentStatus === PaymentStatus.PAID) {
                return {
                    status: HttpStatus.OK,
                    message: 'You already paid for this booking. Thank you!'
                }
            }
        } catch (e) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'Booking Info not found'
            }
        }

        try {
            const paymentInfo = await this.checkoutService.create(paymentData);
            const referenceId = paymentInfo.referenceId;
            if (paymentData) {
                const data = await this.mayaService.checkout({
                    totalAmount: {
                        value: paymentData.amount,
                        currency: 'PHP',
                    },
                    requestReferenceNumber: referenceId,
                });
                return data;
            }
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'Payment Data is required'
            }
        } catch (e) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: `Error in processing payment: CODE - ${e.code}`
            }
        }
    }

    @Post('/verify')
    @ApiBody({ required: true, description: "A webhook for payment process of maya, consumes PAYMENT_SUCCESS, PAYMENT_FAILED, PAYMENT_EXPIRED, PAYMENT_CANCELLED, and AUTHORIZED" })
    async verifyPayment(@Body() paymentResponse: TPaymentResponse, @Res() response: Response): Promise<Response<TResponseData>> {
        const status = this.mayaService.verifyPayment(paymentResponse);
        let bookingId = '';

        try {
            bookingId = (await this.checkoutService.findOne(paymentResponse.requestReferenceNumber))?.bookingId;
            if (!bookingId) 
                return response.status(HttpStatus.OK).send({
                    status: HttpStatus.OK,
                    message: 'Booking Info not found. Check your reference number.'
                });
        } catch (e) {
            console.warn(new Date(), e);
            return response.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'Booking Info not found. Check your reference number.'
            });
        }

        switch(status){
            case TPaymentStatus.SUCCESS: {
                try {
                    const paymentInfo = await this.checkoutService.update({ 
                        referenceId: paymentResponse.requestReferenceNumber, 
                        status: TCheckoutPaymentStatus.SUCCESS, 
                        updatedAt: new Date(),
                        receiptNumber: paymentResponse.receiptNumber,
                        paymentType: paymentResponse.fundSource.type === 'card' ? TPaymentType.CREDIT_CARD : TPaymentType.E_WALLET,
                        success_response: JSON.stringify(paymentResponse)
                    });
                    // Update Booking Payment Status
                    await this.bookingService.update({ id: bookingId, paymentStatus: PaymentStatus.PAID, approval_code: paymentResponse.approvalCode});
                    delete paymentInfo.success_response;
                    return response.status(HttpStatus.OK).send({
                        status: HttpStatus.OK,
                        message: 'Payment has been verified',
                        data: paymentInfo
                    });
                } catch(e) {
                    console.warn(new Date(), e);
                    return response.status(HttpStatus.OK).send({
                        status: HttpStatus.OK,
                        message: 'Payment stuck while verifying. Please contact support.',
                        data: {
                            status: paymentResponse.status,
                            receiptNumber: paymentResponse.receiptNumber,
                            errorMessage: e.detail,
                        }
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
                        success_response: JSON.stringify(paymentResponse)
                    });
                    delete paymentInfo.success_response;
                    return response.status(HttpStatus.OK).send({
                        status: HttpStatus.OK,
                        message: 'Payment process is still pending. Please wait for the payment to be verified.',
                        data: paymentInfo
                    });
                } catch(e) {
                    console.warn(new Date(), e);
                    return response.status(HttpStatus.OK).send({
                        status: HttpStatus.OK,
                        message: 'Payment stuck while verifying. Please contact support.',
                        data: {
                            status: paymentResponse.status,
                            receiptNumber: paymentResponse.receiptNumber,
                        }
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
                        paymentType: paymentResponse.fundSource.type === 'card' ? TPaymentType.CREDIT_CARD : TPaymentType.E_WALLET,
                        failed_response: JSON.stringify(paymentResponse)
                    });

                    delete paymentInfo.failed_response;
                    return response.status(HttpStatus.OK).send({
                        status: HttpStatus.OK,
                        message: 'Payment failed, cancelled or cannot be verified.',
                        data: paymentInfo
                    });
                } catch (e) {
                    console.warn(new Date(), e);
                    return response.status(HttpStatus.OK).send({
                        status: HttpStatus.OK,
                        message: 'Payment has not been verified'
                    });
                }
            }
        }
    }
}
