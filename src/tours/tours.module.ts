import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursService } from './tours.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
import { ToursController } from './tours.controller';
import { TourModel } from './tours.model';
import { CacheModule } from '@nestjs/cache-manager';
import { S3BucketService } from 'src/middlewares/s3.service';
import { PackagesService } from 'src/packages/packages.service';
import { PackageModel } from 'src/packages/packages.model';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([TourModel]),
    TypeOrmModule.forFeature([PackageModel]),
  ],
  providers: [ToursService, S3Service, S3BucketService, PackagesService],
  exports: [ToursService],
  controllers: [ToursController],
})
export class ToursModule {}
