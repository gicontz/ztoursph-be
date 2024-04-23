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

@Module({
  imports: [TypeOrmModule.forFeature([TourModel, PackageModel])],
  controllers: [PdfController],
  exports: [PdfService],
  providers: [
    PdfService,
    S3Service,
    S3BucketService,
    ToursService,
    PackagesService,
  ],
})
export class PdfModule {}
