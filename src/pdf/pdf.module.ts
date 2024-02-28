import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { S3BucketService } from 'src/middlewares/s3.service';
import { S3Service } from 'src/aws-sdk/s3.object';

@Module({
  controllers: [PdfController],
  providers: [PdfService, S3Service, S3BucketService],
})
export class PdfModule {}
