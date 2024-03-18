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
      filename: `pdf_${filename.toLowerCase().replaceAll(' ', '')}_${new Date()
        .toLocaleDateString()
        .replaceAll('/', '')}`,
      buffer: buffer,
      mimetype: 'application/pdf',
    };
  }

  private templatePDFItenerary(content: TPDFItenerary): PDFKit.PDFDocument {
    const {guest, email, contact, tour_date, eta, etd, booked_tours} = content
    const leadGuest = guest.filter((guest => guest.lead_guest === true))[0]
    const adults = guest.filter((guest) => guest.age >= 18);
    const minors = guest.filter((guest) => guest.age < 18);
    const nationality = Array.from(new Set(guest.map( e => e.nationality )))

    const paper = { size: 'A7', margin: 30 }
    const fontSize = { small: 2, default: 3, medium: 4, large: 10 };
    
    const FONT_HELVETICA = 'Helvetica';
    const FONT_COURIER = 'Courier';
    const FONT_HELVETICA_BOLD = 'Helvetica-Bold';
    
    const MARGIN_X = 15;
    const MARGIN_Y = 20;
    const JUSTIFY_END = 160 + MARGIN_X;
    const ALIGN_END = 215 + MARGIN_Y;
    const FONT_SIZE = { small: 2, default: 3, medium: 4, large: 10 };
    
    interface ConfigureTextContentProps {
      text: string;
      font?: string;
      size?: number;
      position?: { x?: number; y?: number };
      options?: PDFKit.Mixins.TextOptions;
    }
    
    const doc = new PDFKit(paper);

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
        position: { x: MARGIN_X + x, y: MARGIN_Y + y },
        text: 'Itinerary',
      });

      configureTextContent({
        position: { x: MARGIN_X + x, y: MARGIN_Y + y + 10 },
        text: `Invoice Number: ${'INV-082023'}`,
      });

      configureTextContent({
        position: { x: MARGIN_X + x, y: MARGIN_Y + y + 13 },
        text: `Date: ${new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeZone: 'Asia/Manila',
        }).format(new Date())}`,
      });
    };

    const div_2 = (x, y) => {
      configureTextContent({
        text: 'RIZAL ST BRGY MALIGAYA EL NIDO, PALAWAN PHILIPPINES 5313',
        font: 'Helvetica',
        position: { x: JUSTIFY_END + x, y: MARGIN_Y + y },
        options: { width: 50, align: 'left' },
      });

      configureTextContent({
        text: 'Email: ztoursph@gmail.com',
        font: 'Helvetica',
        position: { x: JUSTIFY_END + x, y: MARGIN_Y + y + 7 },
        options: { width: 50, align: 'left' },
      });

      configureTextContent({
        text: 'Whatsapp: +639664428625',
        font: 'Helvetica',
        position: { x: JUSTIFY_END + x, y: MARGIN_Y + y + 10.5 },
        options: { width: 50, align: 'left' },
      });

      configureTextContent({
        text: 'Office number: +639664428625',
        font: 'Helvetica',
        position: { x: JUSTIFY_END + x, y: MARGIN_Y + y + 14 },
        options: { width: 50, align: 'left' },
      });
    };

    const div_3 = (x, y) => {
      configureTextContent({
        text: 'Guest Information',
        font: 'Helvetica-Bold',
        size: fontSize.medium + 2,
        position: { x: 160 / 2 - x, y: MARGIN_Y + y },
        options: { width: 55, align: 'center' },
      });
    };

    const div_4 = (x, y) => {
      // Lead Guest Value
      configureTextContent({
        text: leadGuest.name,
        font: FONT_HELVETICA,
        size: fontSize.medium,
        position: { x: MARGIN_X + x + 36, y: MARGIN_Y + y },
        options: { width: 80 },
      });

      // Quantity Value
      configureTextContent({
        text: guest.length.toString(),
        font: FONT_HELVETICA,
        size: fontSize.medium,
        position: { x: MARGIN_X + x + 19, y: MARGIN_Y + y + 5 },
        options: { width: 80, align: 'left' },
      });

      // Adult Value
      configureTextContent({
        text: adults.length.toString(),
        font: FONT_HELVETICA,
        size: fontSize.medium,
        position: { x: MARGIN_X + x + 13, y: MARGIN_Y + y + 10 },
        options: { width: 80 },
      });

      // Minor/Kid Value
      configureTextContent({
        text: minors.length.toString(),
        font: FONT_HELVETICA,
        size: fontSize.medium,
        position: { x: MARGIN_X + x + 20, y: MARGIN_Y + y + 15 },
        options: { width: 80 },
      });

      // Nationality Value
      configureTextContent({
        text: typeof nationality === 'string' ? nationality : nationality.join(', '),
        font: FONT_HELVETICA,
        size: fontSize.medium, 
        position: { x: MARGIN_X + x + 23, y: MARGIN_Y + y + 20 },
        options: { width: 80 },
      });

      // Tour Date Value
      configureTextContent({
        text: tour_date,
        font: FONT_HELVETICA,
        size: fontSize.medium,
        position: { x: JUSTIFY_END + x - 18, y: MARGIN_Y + y },
        options: { width: 80 },
      });

      // Email Value
      configureTextContent({
        text: email || 'N/A',
        font: FONT_HELVETICA,
        size: fontSize.medium,
        position: { x: MARGIN_X + x + 13, y: MARGIN_Y + y + 25 },
        options: { width: 80 },
      });

      // Contact Number Value
      configureTextContent({
        text: contact.toString(),
        font: FONT_HELVETICA,
        size: fontSize.medium,
        position: { x: MARGIN_X + x + 33, y: MARGIN_Y + y + 30 },
        options: { width: 80 },
      });

      // Departure Date Value
      configureTextContent({
        text: eta,
        font: FONT_HELVETICA,
        size: fontSize.medium,
        position: { x: JUSTIFY_END + x - 30, y: MARGIN_Y + y + 10 },
        options: { width: 80 },
      });

      // ETA Value
      configureTextContent({
        text: etd,
        font: FONT_HELVETICA,
        size: fontSize.medium,
        position: { x: JUSTIFY_END + x - 30, y: MARGIN_Y + y + 5 },
        options: { width: 80 },
      });

      //Boilerplates
      configureTextContent({
        text: 'Lead Guest Name:',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: { x: MARGIN_X + x, y: MARGIN_Y + y },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Quantity:',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: { x: MARGIN_X + x, y: MARGIN_Y + y + 5 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Adult:',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: { x: MARGIN_X + x, y: MARGIN_Y + y + 10 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Minor/Kid: ',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: { x: MARGIN_X + x, y: MARGIN_Y + y + 15 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Nationality: ',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: { x: MARGIN_X + x, y: MARGIN_Y + y + 20 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Email: ',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: { x: MARGIN_X + x, y: MARGIN_Y + y + 25 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Contact Number: ',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: { x: MARGIN_X + x, y: MARGIN_Y + y + 30 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'Tour Date: ',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: { x: JUSTIFY_END + x - 40, y: MARGIN_Y + y },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'ETA: ',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: { x: JUSTIFY_END + x - 40, y: MARGIN_Y + y + 5 },
        options: { width: 80 },
      });

      configureTextContent({
        text: 'ETD: ',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: { x: JUSTIFY_END + x - 40, y: MARGIN_Y + y + 10 },
        options: { width: 80 },
      });
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
            renderer: (value) =>
              `P ${new Intl.NumberFormat('en-PH', {
                currency: 'PHP',
              }).format(Number(value))}`,
          },
        ],

        datas: [
          ...booked_tours,
          {
            date: '',
            description: '',
            time: 'GrandTotal',
            subtotal: booked_tours.reduce((acc, cur) => acc + Number(cur.subtotal), 0).toString(),
          },
        ],
      };
      // the magic (async/await)
      await doc.table(table, {
        x: MARGIN_X + x,
        y: MARGIN_Y + y,
        prepareHeader: () => doc.font('Helvetica').fontSize(fontSize.medium),
        prepareRow() {
          return doc.font('Helvetica').fontSize(fontSize.default);
        },
      });
    };

    const div_6 = (x, y) => {
      doc.page.margins.bottom = 0;

      configureTextContent({
        text: 'Term and Conditions:',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: { x: MARGIN_X + x, y: ALIGN_END + y },
        options: { width: 70, align: 'left' },
      });

      configureTextContent({
        text: 'Confirmation is due 5 days from the invoice date',
        font: FONT_HELVETICA,
        size: fontSize.default,
        position: { x: MARGIN_X + x, y: ALIGN_END + y + 6 },
        options: { width: 70, align: 'left' },
      });

      configureTextContent({
        text: 'Prepared by :',
        font: FONT_HELVETICA,
        size: fontSize.default,
        position: {
          x: JUSTIFY_END + x - 30,
          y: ALIGN_END + y - 3,
        },
        options: { width: 70, align: 'left' },
      });

      configureTextContent({
        text: 'Jeo Invento',
        font: FONT_HELVETICA_BOLD,
        size: fontSize.medium,
        position: {
          x: JUSTIFY_END + x - 30,
          y: ALIGN_END + y + 2,
        },
        options: { width: 40, align: 'center' },
      });

      configureTextContent({
        text: 'Operation Manager',
        font: FONT_HELVETICA,
        size: fontSize.default,
        position: {
          x: JUSTIFY_END + x - 30,
          y: ALIGN_END + y + 6,
        },
        options: { width: 40, align: 'center' },
      });
      doc.page.margins.bottom = 30;
    };

    /**
     * -- Masterlist --
     * Fullname, Age, Nationality
     */

    const div_7 = async (x, y) => {
      doc.addPage(paper)
      const guestData = [...guest].map((e) => {
          return {
            name: e.name,
            age: e.age.toString(),
            nationality: e.nationality
          }
        })

      const table = {
        addPage: true,
        headers: [
          {
            label: 'Name',
            property: 'name',
            width: 100,
          },
          { label: 'Age', property: 'age', width: 25 },
          { label: 'Nationality', property: 'nationality', width: 54 },
        ],

        datas: guestData
      };


      configureTextContent({
        text: 'Masterlist',
        font: 'Helvetica-Bold',
        size: fontSize.medium + 2,
        position: { x: 154 / 2 - x, y: MARGIN_Y + y },
        options: { width: 55, align: 'center' },
      });

      await doc.table(table, {
        x: MARGIN_X + x,
        y: MARGIN_Y + y + 15,
        prepareHeader: () => doc.font('Helvetica').fontSize(fontSize.medium),
        prepareRow: () => doc.font('Helvetica').fontSize(fontSize.default),
      });
    };

    const addDivContent = function (func, x, y) {
      return func(x, y);  
    };

    addDivContent(div_1, 0, 0);
    addDivContent(div_2, -40, 0);
    addDivContent(div_3, 5, 20);
    addDivContent(div_4, 0, 30);
    addDivContent(div_5, 0, 75);
    addDivContent(div_6, 0, 30);
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
