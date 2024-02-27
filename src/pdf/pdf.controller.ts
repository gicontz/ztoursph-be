import { Body, Controller, Post } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly PDFService: PdfService) {}
  @Post()
  async getTest(@Body() body: { title: string }) {
    const pdf = await this.PDFService.GeneratePDF(body.title);
    return pdf;
  }
}
