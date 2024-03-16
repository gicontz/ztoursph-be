import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { UsersService } from 'src/users/users.service';
import { TCheckout, TPayment } from './checkout.model';
import { BookingsService } from 'src/bookings/bookings.service';
import { PaymentStatus } from 'src/bookings/bookings.model';
import { MayaService } from 'src/third-party/maya-sdk/maya.service';
import { CheckoutService } from './checkout.service';
import { PAYMENT_DTO_EXAMPLE, TPaymentDTO } from './checkout.dto';

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
        } catch (e) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'Booking Info not found'
            }
        }

        // Checkout Payment if Booking Exists
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
}
