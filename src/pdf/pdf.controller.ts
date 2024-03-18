import { Body, Controller, Post } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
import { S3BucketService } from 'src/middlewares/s3.service';
import { TPDFItenerary } from './pdf.dto';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly PDFService: PdfService,
    private readonly s3Service: S3Service,
    private readonly seServiceBucket: S3BucketService,
  ) {}
  @Post()
  async getTest(@Body() body: { content: TPDFItenerary }) {
    const pdf = await this.PDFService.generateItenerary(body.content,"Test-PDF-03-05-2004");
    await this.s3Service.uploadFiles([pdf]);
    return this.seServiceBucket.getPDF(pdf.filename);
  }
}
