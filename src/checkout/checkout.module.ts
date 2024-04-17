import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UserModel } from 'src/users/users.model';
import { CacheModule } from '@nestjs/cache-manager';
import { BookingsService } from 'src/bookings/bookings.service';
import { BookingModel } from 'src/bookings/bookings.model';
import { MayaService } from 'src/third-party/maya-sdk/maya.service';
import { CheckoutModel } from './checkout.model';
import { ToursService } from 'src/tours/tours.service';
import { PackagesService } from 'src/packages/packages.service';
import { TourModel } from 'src/tours/tours.model';
import { PackageModel } from 'src/packages/packages.model';
import { PaymentLogsModel } from './logs.model';
import { SmtpService } from 'src/third-party/smtp/smtp.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
import { S3BucketService } from 'src/middlewares/s3.service';
import { PdfService } from 'src/pdf/pdf.service';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([UserModel]),
    TypeOrmModule.forFeature([BookingModel]),
    TypeOrmModule.forFeature([CheckoutModel]),
    TypeOrmModule.forFeature([PaymentLogsModel]),
    TypeOrmModule.forFeature([TourModel]),
    TypeOrmModule.forFeature([PackageModel]),
  ],
  providers: [
    CheckoutService,
    MayaService,
    UsersService,
    BookingsService,
    ToursService,
    PackagesService,
    SmtpService,
    S3Service,
    S3BucketService,
    PdfService,
  ],
  exports: [CheckoutService, UsersService, BookingsService],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
