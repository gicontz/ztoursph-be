import { Injectable } from '@nestjs/common';
import * as PDFKit from 'pdfkit';
import { Stream } from 'stream';
import { S3Service } from 'src/aws-sdk/s3.object';

@Injectable()
export class PdfService {
  constructor(private readonly s3Service: S3Service) {}
  async GeneratePDF(
    content: string,
    filename: string,
    bucketname?: string | undefined,
  ): Promise<any> {
    const doc = this.createPDFDocument(content);
    const buffer = await this.streamToBuffer(doc);

    return {
      bucketname: bucketname || process.env.AWS_S3_BUCKET,
      filename: `pdf_${filename.toLowerCase().replaceAll(' ', '')}_${new Date()
        .toLocaleDateString()
        .replaceAll('/', '')}`,
      buffer: buffer,
      mimetype: 'application/pdf',
    };
  }

  async generateBookingItinerary(
    content: any,
    id: string,
    bucketname?: string | undefined,
  ): Promise<any> {
    const doc = this.templateBookingItinerary(content, id);
    const buffer = await this.streamToBuffer(doc);

    return {
      bucketname: bucketname || process.env.AWS_S3_BUCKET,
      filename: `itinerary_${id}_${new Date()
        .toLocaleDateString()
        .replaceAll('/', '')}`, //What if the user has booked multiple times?
      buffer: buffer,
      mimetype: 'application/pdf',
    };
  }

  private templateBookingItinerary(
    content: string,
    ...rest: any
  ): PDFKit.PDFDocument {
    const doc = new PDFKit({ size: 'A7' });

    // Style PDF File
    doc.fontSize(10).text(content, 5, 5, { align: 'left' });
    doc.fontSize(10).text(rest?.id, 20, 20, { align: 'left' });
    doc.end();

    return doc;
  }

  private templateCheckoutReciept(content: string): PDFKit.PDFDocument {
    const doc = new PDFKit({ size: 'A7' });

    // Style PDF File
    doc.fontSize(23).text(content, 5, 5, { align: 'left' });

    doc.end();

    return doc;
  }

  private createPDFDocument(content: string): PDFKit.PDFDocument {
    const doc = new PDFKit({ size: 'A7' });

    // Style PDF File
    doc.fontSize(23).text(content, 5, 5, { align: 'left' });

    doc.end();

    return doc;
  }

  private streamToBuffer(stream: Stream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buffer: Buffer[] = [];

      stream.on('data', (chunk) => {
        buffer.push(chunk);
      });

      stream.on('end', () => {
        resolve(Buffer.concat(buffer));
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
  }
}
