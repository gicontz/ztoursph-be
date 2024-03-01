import { Injectable } from '@nestjs/common';
import PDFKit from 'pdfkit-table';

@Injectable()
export class PdfService {
  async generatePDF(
    content: string,
    filename: string,
    bucketname?: string | undefined,
  ): Promise<any> {
    const doc = this.templatePDFDocument(content);
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

  private templatePDFDocument(content: string): PDFKit.PDFDocument {
    const doc = new PDFKit({ size: 'A7', margin: 30 });
    const paper = { x: 160, y: 215 };
    const padding = { x: 15, y: 20 };
    const fontSize = { small: 2, default: 3, medium: 4, large: 10 };

    const textContent = (
      text: string | number,
      options: {
        font?: string;
        size?: number;
        position: { x: number; y: number };
        width?: number;
        align?: 'left' | 'center' | 'right';
      },
    ) => {
      doc
        .font(options.font || 'Helvetica')
        .fontSize(options.size || fontSize.default)
        .text(text.toString(), options.position.x, options.position.y, {
          width: options.width,
          align: options.align || 'left',
        });
    };

    const div_1 = (x, y) => {
      textContent('Itinerary', {
        font: 'Courier',
        size: fontSize.large,
        position: { x: padding.x + x, y: padding.y + y },
      });

      textContent(`Invoice Number: ${'INV-082023'}`, {
        position: { x: padding.x + x, y: padding.y + y + 10 },
      });

      textContent(
        `Date: ${new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeZone: 'Asia/Manila',
        }).format(new Date())}`, // Time is Placeholder, set to now
        {
          position: { x: padding.x + x, y: padding.y + y + 13 },
        },
      );
    };

    const div_2 = (x, y) => {
      const right = paper.x - padding.x;

      textContent(`RIZAL ST BRGY MALIGAYA EL NIDO, PALAWAN PHILIPPINES 5313`, {
        font: 'Helvetica',
        position: { x: right - x, y: padding.y + y },
        width: 50,
        align: 'left',
      });

      textContent('Email: ztoursph@gmail.com', {
        font: 'Helvetica',
        position: { x: right - x, y: padding.y + y + 7 },
        width: 50,
        align: 'left',
      });

      textContent('Whatsapp: +639664428625', {
        font: 'Helvetica',
        position: { x: right - x, y: padding.y + y + 10.5 },
        width: 50,
        align: 'left',
      });

      textContent('Office number: +639664428625', {
        font: 'Helvetica',
        position: { x: right - x, y: padding.y + y + 13.5 },
        width: 50,
        align: 'left',
      });
    };

    const div_3 = (x, y) => {
      textContent('Guest Information', {
        font: 'Helvetica-Bold',
        size: fontSize.medium + 2,
        position: { x: paper.x / 2 - x, y: padding.y + y },
        width: 55,
        align: 'center',
      });
    };

    const div_4 = (x, y) => {
      const right = paper.x - padding.x;

      textContent('Lead Guest Name:', {
        size: fontSize.medium,
        font: 'Helvetica-Bold',
        position: { x: padding.x + x, y: padding.y + y },
        width: 80,
      });
      //Lead Guest Name Value
      textContent('John Doe', {
        size: fontSize.medium,
        font: 'Helvetica',
        position: { x: padding.x + x + 36, y: padding.y + y },
        width: 80,
        align: 'left',
      });

      textContent('Quantity:', {
        size: fontSize.medium,
        font: 'Helvetica-Bold',
        position: { x: padding.x + x, y: padding.y + y + 5 },
        width: 80,
      });
      //Quantity Value
      textContent(8, {
        size: fontSize.medium,
        font: 'Helvetica',
        position: { x: padding.x + x + 19, y: padding.y + y + 5 },
        width: 80,
        align: 'left',
      });

      textContent('Adult: ', {
        size: fontSize.medium,
        font: 'Helvetica-Bold',
        position: { x: padding.x + x, y: padding.y + y + 10 },
        width: 80,
      });
      //Adult Value
      textContent(2, {
        size: fontSize.medium,
        font: 'Helvetica',
        position: { x: padding.x + x + 13, y: padding.y + y + 10 },
        width: 80,
      });

      textContent('Minor/Kid: ', {
        size: fontSize.medium,
        font: 'Helvetica-Bold',
        position: { x: padding.x + x, y: padding.y + y + 15 },
        width: 80,
      });
      //Minor/Kid:
      textContent('3 (4-7) ', {
        size: fontSize.medium,
        font: 'Helvetica',
        position: { x: padding.x + x + 20, y: padding.y + y + 15 },
        width: 80,
      });

      textContent('Nationality: ', {
        size: fontSize.medium,
        font: 'Helvetica-Bold',
        position: { x: padding.x + x, y: padding.y + y + 20 },
        width: 80,
      });
      textContent('Filipino/American ', {
        size: fontSize.medium,
        font: 'Helvetica',
        position: { x: padding.x + x + 23, y: padding.y + y + 20 },
        width: 80,
      });

      textContent('Email: ', {
        size: fontSize.medium,
        font: 'Helvetica-Bold',
        position: { x: padding.x + x, y: padding.y + y + 25 },
        width: 80,
      });
      textContent('N/A', {
        size: fontSize.medium,
        font: 'Helvetica',
        position: { x: padding.x + x + 13, y: padding.y + y + 25 },
        width: 80,
      });

      textContent('Contact Number: ', {
        size: fontSize.medium,
        font: 'Helvetica-Bold',
        position: { x: padding.x + x, y: padding.y + y + 30 },
        width: 80,
      });
      //Contact Number Value
      textContent(999999989, {
        size: fontSize.medium,
        font: 'Helvetica',
        position: { x: padding.x + x + 33, y: padding.y + y + 30 },
        width: 80,
      });

      textContent('Tour Date: ', {
        size: fontSize.medium,
        font: 'Helvetica-Bold',
        position: { x: right - padding.x - x, y: padding.y + y },
        width: 80,
      });
      //Tour Date Value
      textContent(
        new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeZone: 'Asia/Manila',
        }).format(new Date()),
        {
          size: fontSize.medium,
          font: 'Helvetica',
          position: { x: right - padding.x - x + 20, y: padding.y + y },
          width: 80,
        },
      );

      textContent('ETA: ', {
        size: fontSize.medium,
        font: 'Helvetica-Bold',
        position: { x: right - padding.x - x, y: padding.y + y + 5 },
        width: 80,
      });
      //ETA Value
      textContent(
        `LIO Airport ${new Intl.DateTimeFormat('en-US', {
          dateStyle: 'short',
          timeStyle: 'short',
          timeZone: 'Asia/Manila',
        }).format(new Date())}`,
        {
          size: fontSize.medium,
          font: 'Helvetica',
          position: { x: right - padding.x - x + 11, y: padding.y + y + 5 },
          width: 80,
        },
      );

      textContent('ETD: ', {
        size: fontSize.medium,
        font: 'Helvetica-Bold',
        position: { x: right - padding.x - x, y: padding.y + y + 10 },
        width: 80,
      });
      //Departure Date Value
      textContent(
        `LIO Airport ${new Intl.DateTimeFormat('en-US', {
          dateStyle: 'short',
          timeStyle: 'short',
          timeZone: 'Asia/Manila',
        }).format(new Date())}`,
        {
          size: fontSize.medium,
          font: 'Helvetica',
          position: { x: right - padding.x - x + 11, y: padding.y + y + 10 },
          width: 80,
        },
      );
    };

    const div_5 = async (x, y) => {
      const table = {
        addPage: true,
        headers: [
          {
            label: 'Date',
            property: 'date',
            width: 30,
          },
          { label: 'Description', property: 'description', width: 85 },
          { label: 'Time', property: 'time', width: 40 },
          {
            label: 'Sub-Total',
            property: 'subtotal',
            width: 20,
            renderer: (value) => `P ${value}`,
          },
        ],

        datas: [
          {
            date: new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.  ',
            time: new Intl.DateTimeFormat('en-US', {
              timeStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            subtotal: '1,500',
          },
          {
            date: new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.  ',
            time: new Intl.DateTimeFormat('en-US', {
              timeStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            subtotal: '1,500',
          },
          {
            date: new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.  ',
            time: new Intl.DateTimeFormat('en-US', {
              timeStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            subtotal: '1,500',
          },
          {
            date: new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.  ',
            time: new Intl.DateTimeFormat('en-US', {
              timeStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            subtotal: '1,500',
          },
          {
            date: new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.  ',
            time: new Intl.DateTimeFormat('en-US', {
              timeStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            subtotal: '1,500',
          },
          {
            date: new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.  ',
            time: new Intl.DateTimeFormat('en-US', {
              timeStyle: 'medium',
              timeZone: 'Asia/Manila',
            }).format(new Date()),
            subtotal: '1,500',
          },
          {
            date: '',
            description: '',
            time: 'GrandTotal',
            subtotal: '1,500',
          },
        ],
      };
      // the magic (async/await)
      await doc.table(table, {
        x: padding.x + x,
        y: padding.y + y,
        prepareHeader: () => doc.font('Helvetica').fontSize(fontSize.medium),
        prepareRow() {
          return doc.font('Helvetica').fontSize(fontSize.default);
        },
      });
    };

    const div_6 = (x, y) => {
      const right = paper.x - padding.x;
      doc.page.margins.bottom = 0;

      textContent(`Term and Conditions:`, {
        font: 'Helvetica-Bold',
        size: fontSize.medium,
        position: { x: padding.x + x, y: paper.y + padding.y + y },
        width: 70,
        align: 'left',
      });
      textContent(`Confirmation is due 5 days from the invoice date`, {
        font: 'Helvetica',
        size: fontSize.default,
        position: { x: padding.x + x, y: paper.y + padding.y + y + 6 },
        width: 70,
        align: 'left',
      });

      textContent(`Prepared by :`, {
        font: 'Helvetica',
        size: fontSize.default,
        position: { x: right - padding.x - x, y: paper.y + padding.y + y - 1 },
        width: 70,
        align: 'left',
      });
      textContent(`Jeo Invento`, {
        font: 'Helvetica-Bold',
        size: fontSize.medium,
        position: {
          x: right - padding.x - x - 10,
          y: paper.y + padding.y + y + 3,
        },
        width: 70,
        align: 'center',
      });
      textContent(`Operation Manager`, {
        font: 'Helvetica',
        size: fontSize.default,
        position: {
          x: right - padding.x - x - 10,
          y: paper.y + padding.y + y + 8,
        },
        width: 70,
        align: 'center',
      });
    };

    div_1(0, 0);
    div_2(0, 0);
    div_3(5, 20);
    div_4(0, 30);
    div_5(0, 75);
    div_6(0, 30);

    doc.end();

    return doc;
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

  private templateBookingItinerary(content: string, ...rest: any) {
    const doc = new PDFKit({ size: 'A7' });

    // Style PDF File
    doc.fontSize(10).text(content, 5, 5, { align: 'left' });
    doc.fontSize(10).text(rest?.id, 20, 20, { align: 'left' });
    doc.end();

    return doc;
  }

  private templateCheckoutReciept(content: string) {
    const doc = new PDFKit({ size: 'A7' });

    // Style PDF File
    doc.fontSize(23).text(content, 5, 5, { align: 'left' });

    doc.end();

    return doc;
  }

  private streamToBuffer(stream: any): Promise<Buffer> {
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
