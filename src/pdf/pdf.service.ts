import { Injectable } from '@nestjs/common';
import * as PDFKit from 'pdfkit';
import { Stream } from 'stream';

@Injectable()
export class PdfService {
  async GeneratePDF(Content: string): Promise<Buffer> {
    const doc = this.createPDFDocument(Content);
    const buffer = await this.streamToBuffer(doc);
    return buffer;
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
