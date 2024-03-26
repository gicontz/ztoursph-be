import { Body, Controller, Post, Query, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
import { S3BucketService } from 'src/middlewares/s3.service';
import { TPDFItenerary } from './pdf.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';

@ApiTags('Itinerary')
@Controller('itinerary')
export class PdfController {
  constructor(
    private readonly PDFService: PdfService,
    private readonly s3Service: S3Service,
    private readonly seServiceBucket: S3BucketService,
  ) {}

  @Post()
  @ApiBody({
    required: true,
    type: TPDFItenerary,
    examples: {
      example1: {
        value: {
          content: {
            firstname: 'John',
            lastname: 'Doe',
            age: 20,
            nationality: 'Filipino',
            email: 'test@test.com',
            mobileNumber1: 1234567890,
            mobileNumber2: 1234567890,
            booking_date: '2022-12-12',
            guests: [
              {
                name: 'Jane Doe',
                age: 20,
                nationality: 'Filipino',
              },
            ],
            booked_tours: [
              {
                id: 1,
                category: 'tours',
                pax: 2,
                date: '2022-12-12',
                time: '12:00',
                description: 'Test Description',
                subtotal: '1000',
              },
            ],
          },
        },
      },
    },
  })
  @ApiQuery({ name: 'upload', type: Boolean, required: false })
  async getTest(
    @Body() body: { content: TPDFItenerary },
    @Query('upload') upload?: 'true' | 'false',
    @Res() res?: ExpressResponse,
  ) {
    const fileName = `Itinerary-${Date.now()}-${body.content.lastname}.pdf`;
    const pdf = await this.PDFService.generateItenerary(body.content, fileName);

    if (upload === 'true') {
      try {
        await this.s3Service.uploadFiles([pdf]);
        const uploadedPdf = await this.seServiceBucket.getPDF(fileName);
        return res.status(201).send(uploadedPdf);
      } catch (error) {
        console.error('Error uploading PDF:', error);
        return res.status(500).send({ message: 'Failed to upload PDF' });
      }
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );

      return res.status(201).send(pdf.buffer);
    }
  }
}
