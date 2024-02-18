import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { S3BucketService } from 'src/middlewares/s3.service';
import { S3Service } from 'src/aws-sdk/s3.object';
import { BookingModel } from './bookings.model';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';

@Module({
  providers: [BookingsService, S3Service, S3BucketService],
  imports: [CacheModule.register(), TypeOrmModule.forFeature([BookingModel])],
  exports: [BookingsService],
  controllers: [BookingsController]
})
export class BookingsModule {}
