import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { UsersService } from 'src/users/users.service';
import { TCheckout } from './checkout.model';
import { BookingsService } from 'src/bookings/bookings.service';
import { PaymentStatus } from 'src/bookings/bookings.model';
import { MayaService } from 'src/third-party/maya-sdk/maya.service';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
    constructor(
        private readonly userService: UsersService,
        private readonly mayaService: MayaService,
        private readonly bookingService: BookingsService) {}

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
    async checkoutPayment(): Promise<TResponseData> {
        const data = await this.mayaService.checkout();
        return data;
    }
}
