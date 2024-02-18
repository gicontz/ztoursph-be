import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Module({
  providers: [CheckoutService]
})
export class CheckoutModule {}
