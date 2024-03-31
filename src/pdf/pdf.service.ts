import { Injectable } from '@nestjs/common';
import PDFKit from 'pdfkit-table';
import { TPDFItenerary } from './pdf.dto';

@Injectable()
export class PdfService {
  async generateItenerary(
    content: TPDFItenerary,
    filename: string,
    bucketname?: string | undefined,
  ): Promise<any> {
    const doc = this.templatePDFItenerary(content);
    const buffer = await this.streamToBuffer(doc);

    return {
      bucketname: bucketname || process.env.AWS_S3_BUCKET,
      filename: filename,
      buffer: buffer,
      mimetype: 'application/pdf',
    };
  }

  private templatePDFItenerary(content: TPDFItenerary): PDFKit.PDFDocument {
    const {
      lastName,
      firstName,
      middleInitial,
      age,
      guests,
      email,
      mobileNumber1,
      nationality,
      mobileNumber2,
      booking_date,
      booked_tours,
    } = content;

    const leadGuest = [lastName, firstName, middleInitial].join(' ');
    const adults = guests.filter((guest) => guest.age >= 18).length;
    const minors = guests.filter((guest) => guest.age < 18).length;
    const nationalityUnique = Array.from(
      new Set([nationality, ...guests.map((e) => e.nationality)]),
    );
    const paper = {
      size: 'letter',
      margin: 30,
    };
    const doc = new PDFKit(paper);

    const fontSize = { small: 2, default: 3, medium: 4, large: 10 };

    const FONT_HELVETICA = 'Helvetica';
    const FONT_COURIER = 'Courier';
    const FONT_HELVETICA_BOLD = 'Helvetica-Bold';
    const JUSTIFY_END = doc.page.width - paper.margin;
    const ALIGN_END = doc.page.height - paper.margin;
    const FONT_SIZE = { small: 7, default: 10, medium: 20, large: 40 };

    interface ConfigureTextContentProps {
      text: any;
      font?: string;
      size?: number;
      position?: { x?: number; y?: number };
      options?: PDFKit.Mixins.TextOptions;
    }

    const configureTextContent = ({
      text,
      font = FONT_HELVETICA,
      size = fontSize.default,
      position,
      options = {} as PDFKit.Mixins.TextOptions,
    }: ConfigureTextContentProps) => {
      return doc
        .font(font || FONT_HELVETICA)
        .fontSize(size || FONT_SIZE.default)
        .text(text.toString(), position?.x, position?.y, {
          width: options?.width,
          align: options?.align || 'left',
          ...options,
        });
    };

    const div_1 = (x, y) => {
      configureTextContent({
        font: FONT_COURIER,
        size: FONT_SIZE.large,
        position: {
          x: x + paper.margin,
          y: y + paper.margin,
        },
        text: 'Itinerary',
      });

      configureTextContent({
        size: FONT_SIZE.default,
        position: {
          x: x + paper.margin,
          y: y + paper.margin + 32,
        },
        text: `Invoice Number: ${'INV-082023'}`,
      });

      configureTextContent({
        size: FONT_SIZE.default,
        position: { x: x + paper.margin, y: y + paper.margin + 45 },
        text: `Date: ${new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeZone: 'Asia/Manila',
        }).format(new Date())}`,
      });
    };

    const div_2 = (x, y) => {
      configureTextContent({
        size: FONT_SIZE.default,
        text: 'RIZAL ST BRGY MALIGAYA EL NIDO, PALAWAN PHILIPPINES 5313',
        font: 'Helvetica',
        position: { x: JUSTIFY_END + x, y: y + paper.margin },
        options: { width: 200, align: 'left' },
      });

      configureTextContent({
        size: FONT_SIZE.default,
        text: 'Email: ztoursph@gmail.com',
        font: 'Helvetica',
        position: {
          x: JUSTIFY_END + x,
          y: y + paper.margin + 23,
        },
        options: { width: 200, align: 'left' },
      });

      configureTextContent({
        size: FONT_SIZE.default,
        text: 'Whatsapp: +639664428625',
        font: 'Helvetica',
        position: {
          x: JUSTIFY_END + x,
          y: y + paper.margin + 21 + 13,
        },
        options: { width: 200, align: 'left' },
      });

      configureTextContent({
        size: FONT_SIZE.default,
        text: 'Office number: +639664428625',
        font: 'Helvetica',
        position: { x: JUSTIFY_END + x, y: y + paper.margin + 21 + 13 * 2 },
        options: { width: 200, align: 'left' },
      });
    };

    const div_3 = (x, y) => {
      configureTextContent({
        text: 'Guest Information',
        font: 'Helvetica-Bold',
        size: FONT_SIZE.medium - 3,
        position: { x: x, y: y + paper.margin },
        options: { width: doc.page.width, align: 'center' },
      });
    };

    const div_8 = (x, y) => {
      configureTextContent({
        text: 'Package and Tours',
        font: 'Helvetica-Bold',
        size: FONT_SIZE.medium - 3,
        position: { x: x, y: y + paper.margin },
        options: { width: doc.page.width, align: 'center' },
      });
    };

    const div_4 = (x, y) => {
      // Lead Guest Value
      configureTextContent({
        text: leadGuest,
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin + 90, y: y },
        options: { width: 200 },
      });

      // Quantity Value
      configureTextContent({
        text: guests.length,
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin + 45, y: y + 13 },
        options: { width: 80, align: 'left' },
      });

      // Adult Value
      configureTextContent({
        text: adults.toString(),
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin + 40, y: y + 13 * 2 },
        options: { width: 80 },
      });

      // Minor/Kid Value
      configureTextContent({
        text: minors.toString(),
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin + 50, y: y + 13 * 3 },
        options: { width: 80 },
      });

      // Nationality Value
      configureTextContent({
        text:
          typeof nationalityUnique === 'string'
            ? nationalityUnique
            : nationalityUnique.join(', '),
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin + 55, y: y + 13 * 4 },
        options: { width: 200 },
      });

      // Booking Date Value
      configureTextContent({
        text: booking_date,
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: { x: JUSTIFY_END + x - 160 + 55, y: y },
        options: { width: 80 },
      });

      // Email Value
      configureTextContent({
        text: email || 'N/A',
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin + 35, y: y + 13 * 5 },
        options: { width: 150 },
      });

      // Contact Number Value
      configureTextContent({
        text: mobileNumber1,
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin + 90, y: y + 13 * 6 },
        options: { width: 80 },
      });
      // Contact Number Value
      configureTextContent({
        text: mobileNumber2,
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin + 90, y: y + 13 * 7 },
        options: { width: 80 },
      });

      // // Departure Date Value
      // configureTextContent({
      //   text: eta,
      //   font: FONT_HELVETICA,
      //   size: fontSize.medium,
      //   position: { x: JUSTIFY_END + x - 30, y: y + 10 },
      //   options: { width: 80 },
      // });

      // // ETA Value
      // configureTextContent({
      //   text: etd,
      //   font: FONT_HELVETICA,
      //   size: fontSize.medium,
      //   position: { x: JUSTIFY_END + x - 30, y: y + 5 },
      //   options: { width: 80 },
      // });

      //Boilerplates
      configureTextContent({
        text: 'Lead Guest Name:',
        font: FONT_HELVETICA_BOLD,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin, y: y },
        options: { width: 100 },
      });

      configureTextContent({
        text: 'Quantity:',
        font: FONT_HELVETICA_BOLD,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin, y: y + 13 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Adult:',
        font: FONT_HELVETICA_BOLD,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin, y: y + 13 * 2 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Minor/Kid: ',
        font: FONT_HELVETICA_BOLD,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin, y: y + 13 * 3 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Nationality: ',
        font: FONT_HELVETICA_BOLD,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin, y: y + 13 * 4 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Email: ',
        font: FONT_HELVETICA_BOLD,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin, y: y + 13 * 5 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Mobile Number 1: ',
        font: FONT_HELVETICA_BOLD,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin, y: y + 13 * 6 },
        options: { width: 100 },
      });

      configureTextContent({
        text: 'Mobile Number 2: ',
        font: FONT_HELVETICA_BOLD,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin, y: y + 13 * 7 },
        options: { width: 100 },
      });

      configureTextContent({
        text: 'Booking Date: ',
        font: FONT_HELVETICA_BOLD,
        size: FONT_SIZE.default,
        position: { x: JUSTIFY_END + x - 175, y: y },
        options: { width: 80 },
      });

      // configureTextContent({
      //   text: 'ETA: ',
      //   font: FONT_HELVETICA_BOLD,
      //   size: fontSize.medium,
      //   position: { x: JUSTIFY_END + x - 40, y: y + 5 },
      //   options: { width: 80 },
      // });

      // configureTextContent({
      //   text: 'ETD: ',
      //   font: FONT_HELVETICA_BOLD,
      //   size: fontSize.medium,
      //   position: { x: JUSTIFY_END + x - 40, y: y + 10 },
      //   options: { width: 80 },
      // });
    };

    const div_5 = async (x, y) => {
      const table = {
        addPage: true,
        headers: [
          {
            label: 'Tour Date',
            property: 'date',
            width: 80,
          },
          { label: 'Description', property: 'description', width: 190 },
          { label: 'Time', property: 'time', width: 90 },
          { label: 'Pax', property: 'pax', width: 90 },
          {
            label: 'Sub-Total',
            property: 'subtotal',
            width: 90,
            renderer: (value) =>
              `P ${new Intl.NumberFormat('en-PH', {
                currency: 'PHP',
              }).format(Number(value))}`,
          },
        ],

        datas: [
          ...booked_tours.map((tour) => ({
            date: tour.date,
            description: tour.description,
            time: tour.pickup_time,
            pax: tour.pax.toString(),
            subtotal: tour.subtotal,
          })),
          {
            date: '',
            description: '',
            time: '',
            pax: 'GrandTotal',
            subtotal: booked_tours
              .reduce((acc, cur) => acc + Number(cur.subtotal), 0)
              .toString(),
          },
        ],
      };
      // the magic (async/await)

      await doc.table(
        { ...table },
        {
          x: x + paper.margin,
          y: y,
          prepareHeader: () =>
            doc.font('Helvetica').fontSize(FONT_SIZE.default),
          prepareRow() {
            return doc.font('Helvetica').fontSize(FONT_SIZE.default);
          },
        },
      );
    };

    const div_6 = (x, y) => {
      doc.page.margins.bottom = 0;

      configureTextContent({
        text: 'Term and Conditions:',
        font: FONT_HELVETICA_BOLD,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin, y: ALIGN_END + y },
        options: { width: 150, align: 'left' },
      });

      configureTextContent({
        text: 'Confirmation is due 5 days from the invoice date',
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: { x: x + paper.margin, y: ALIGN_END + y + 13 },
        options: { width: 180, align: 'left' },
      });

      configureTextContent({
        text: 'Prepared by :',
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: {
          x: JUSTIFY_END + x - 175,
          y: ALIGN_END + y,
        },
        options: { width: 150, align: 'left' },
      });

      configureTextContent({
        text: 'Jeo Invento',
        font: FONT_HELVETICA_BOLD,
        size: FONT_SIZE.default,
        position: {
          x: JUSTIFY_END + x - 175,
          y: ALIGN_END + y + 13,
        },
        options: { width: 150, align: 'center' },
      });

      configureTextContent({
        text: 'Operation Manager',
        font: FONT_HELVETICA,
        size: FONT_SIZE.default,
        position: {
          x: JUSTIFY_END + x - 175,
          y: ALIGN_END + y + 13 * 2,
        },
        options: { width: 150, align: 'center' },
      });
      doc.page.margins.bottom = 30;
    };

    /**
     * -- Masterlist --
     * Fullname, Age, Nationality
     */

    const div_7 = async (x, y) => {
      doc.addPage(paper);
      const guestData = [...guests].map((e) => {
        return {
          name: e.name,
          age: e.age.toString(),
          nationality: e.nationality,
        };
      });

      const table = {
        addPage: true,
        headers: [
          {
            label: 'Name',
            property: 'name',
            width: 275,
          },
          { label: 'Age', property: 'age', width: 75 },
          { label: 'Nationality', property: 'nationality', width: 200 },
        ],

        datas: [
          { name: leadGuest, age, nationality: nationality },
          ...guestData,
        ] as {
          name: string;
          age: string;
          nationality: string;
        }[],
      };

      configureTextContent({
        text: 'Masterlist',
        font: 'Helvetica-Bold',
        size: FONT_SIZE.medium + 2,
        position: { x: x, y: y + paper.margin },
        options: { width: doc.page.width, align: 'center' },
      });

      await doc.table(table, {
        x: x + paper.margin,
        y: y + paper.margin + 40,
        prepareHeader: () => doc.font('Helvetica').fontSize(FONT_SIZE.default),
        prepareRow: () => doc.font('Helvetica').fontSize(FONT_SIZE.default),
      });
    };

    const addDivContent = function (func, x, y) {
      return func(x, y);
    };

    addDivContent(div_1, 0, 0);
    addDivContent(div_2, -175, 0);
    addDivContent(div_3, 0, 90);
    addDivContent(div_4, 0, 150);
    addDivContent(div_8, 0, 240);
    addDivContent(div_5, 0, 300);
    addDivContent(div_6, 0, -50);
    addDivContent(div_7, 0, 0);

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
