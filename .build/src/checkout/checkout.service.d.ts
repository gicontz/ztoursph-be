import { CheckoutModel, TPayment } from './checkout.model';
import { Repository } from 'typeorm';
export declare class CheckoutService {
    private checkoutRepository;
    constructor(checkoutRepository: Repository<CheckoutModel>);
    findOne(id: string): Promise<CheckoutModel | null>;
    create(paymentInfo: TPayment): Promise<CheckoutModel>;
    update(paymentInfo: Partial<TPayment> & {
        referenceId: string;
    }): Promise<CheckoutModel>;
}
