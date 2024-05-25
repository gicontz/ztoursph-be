import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { S3BucketService } from 'src/middlewares/s3.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourModel } from 'src/tours/tours.model';
import { PackageModel } from 'src/packages/packages.model';
import { ToursService } from 'src/tours/tours.service';
import { PackagesService } from 'src/packages/packages.service';
import { BookingsService } from 'src/bookings/bookings.service';
import { BookingModel } from 'src/bookings/bookings.model';
import { UsersService } from 'src/users/users.service';
import { UserModel } from 'src/users/users.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TourModel,
      PackageModel,
      BookingModel,
      UserModel,
    ]),
  ],
  controllers: [PdfController],
  exports: [PdfService],
  providers: [
    PdfService,
    S3Service,
    S3BucketService,
    ToursService,
    PackagesService,
    BookingsService,
    UsersService,
  ],
})
export class PdfModule {}
