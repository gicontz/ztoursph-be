import { TResponseData } from 'src/http.types';
import { UsersService } from 'src/users/users.service';
import { TCheckout, TPayment } from './checkout.model';
import { BookingsService } from 'src/bookings/bookings.service';
import { MayaService } from 'src/third-party/maya-sdk/maya.service';
import { CheckoutService } from './checkout.service';
import { TPaymentResponse } from 'src/third-party/maya-sdk/maya.dto';
export declare class CheckoutController {
    private readonly userService;
    private readonly mayaService;
    private readonly bookingService;
    private readonly checkoutService;
    constructor(userService: UsersService, mayaService: MayaService, bookingService: BookingsService, checkoutService: CheckoutService);
    checkoutTrips(data: TCheckout): Promise<TResponseData>;
    checkoutPayment(paymentData: TPayment): Promise<TResponseData>;
    verifyPayment(paymentResponse: TPaymentResponse): Promise<TResponseData>;
}
