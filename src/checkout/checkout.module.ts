import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UserModel } from 'src/users/users.model';
import { CacheModule } from '@nestjs/cache-manager';
import { BookingsService } from 'src/bookings/bookings.service';
import { BookingModel } from 'src/bookings/bookings.model';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([UserModel]), TypeOrmModule.forFeature([BookingModel])],
  providers: [CheckoutService, UsersService, BookingsService],
  exports: [CheckoutService, UsersService, BookingsService],
  controllers: [CheckoutController]
})
export class CheckoutModule {}
