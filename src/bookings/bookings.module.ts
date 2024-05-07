import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { S3BucketService } from 'src/middlewares/s3.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
import { BookingModel } from './bookings.model';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { PdfService } from 'src/pdf/pdf.service';
import { UsersService } from 'src/users/users.service';
import { UserModel } from 'src/users/users.model';
import { TourModel } from 'src/tours/tours.model';
import { PackageModel } from 'src/packages/packages.model';
import { ToursService } from 'src/tours/tours.service';
import { PackagesService } from 'src/packages/packages.service';

@Module({
  providers: [
    BookingsService,
    S3Service,
    S3BucketService,
    PdfService,
    UsersService,
    ToursService,
    PackagesService,
  ],
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([BookingModel]),
    TypeOrmModule.forFeature([UserModel]),
    TypeOrmModule.forFeature([TourModel]),
    TypeOrmModule.forFeature([PackageModel]),
  ],
  exports: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
