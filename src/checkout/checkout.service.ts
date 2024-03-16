import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckoutModel, TPayment } from './checkout.model';
import { Repository } from 'typeorm';

@Injectable()
export class CheckoutService {
    constructor(
        @InjectRepository(CheckoutModel)
        private checkoutRepository: Repository<CheckoutModel>,
      ) {}

    
    findOne(id: string): Promise<CheckoutModel | null> {
        return this.checkoutRepository.findOneBy({ referenceId: id });
    }

    create(paymentInfo: TPayment): Promise<CheckoutModel> {
        return this.checkoutRepository.save(paymentInfo);
    }

    update(bookingInfo: Partial<TPayment> & { id: string }): Promise<CheckoutModel> {
        return this.checkoutRepository.save(bookingInfo);
    } 

}
