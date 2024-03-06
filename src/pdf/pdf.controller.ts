import { Body, Controller, Post } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { S3Service } from 'src/aws-sdk/s3.object';
import { S3BucketService } from 'src/middlewares/s3.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly PDFService: PdfService,
    private readonly s3Service: S3Service,
    private readonly seServiceBucket: S3BucketService,
  ) {}
  @Post()
  async getTest(@Body() body: { title: string }) {
    const pdf = await this.PDFService.generatePDF(body.title, body.title);
    await this.s3Service.uploadFiles([pdf]);
    return this.seServiceBucket.getPDF(pdf.filename);
  }
}
