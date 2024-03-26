import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckoutModel, TPayment } from './checkout.model';
import { Repository } from 'typeorm';
import { PaymentLogsModel, TPaymentLog } from './logs.model';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(CheckoutModel)
    private checkoutRepository: Repository<CheckoutModel>,
    @InjectRepository(PaymentLogsModel)
    private logsRepository: Repository<PaymentLogsModel>,
  ) {}

  findOne(id: string): Promise<CheckoutModel | null> {
    return this.checkoutRepository.findOneBy({ referenceId: id });
  }

  create(paymentInfo: TPayment): Promise<CheckoutModel> {
    return this.checkoutRepository.save(paymentInfo);
  }

  update(
    paymentInfo: Partial<TPayment> & { referenceId: string },
  ): Promise<CheckoutModel> {
    return this.checkoutRepository.save(paymentInfo);
  }

  log(paymentInfo: TPaymentLog): Promise<PaymentLogsModel> {
    return this.logsRepository.save(paymentInfo);
  }
}
