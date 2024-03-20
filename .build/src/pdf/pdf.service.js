"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_table_1 = require("pdfkit-table");
let PdfService = class PdfService {
    async generatePDF(content, filename, bucketname) {
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
    templatePDFDocument(content) {
        const doc = new pdfkit_table_1.default({ size: 'A7', margin: 30 });
        const fontSize = { small: 2, default: 3, medium: 4, large: 10 };
        const FONT_HELVETICA = 'Helvetica';
        const FONT_COURIER = 'Courier';
        const FONT_HELVETICA_BOLD = 'Helvetica-Bold';
        const MARGIN_X = 15;
        const MARGIN_Y = 20;
        const JUSTIFY_END = 160 + MARGIN_X;
        const ALIGN_END = 215 + MARGIN_Y;
        const FONT_SIZE = { small: 2, default: 3, medium: 4, large: 10 };
        const configureTextContent = ({ text, font = FONT_HELVETICA, size = fontSize.default, position, options = {}, }) => {
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
            configureTextContent({
                text: `${'John Doe'}`,
                font: FONT_HELVETICA,
                size: fontSize.medium,
                position: { x: MARGIN_X + x + 36, y: MARGIN_Y + y },
                options: { width: 80 },
            });
            configureTextContent({
                text: `${8}`,
                font: FONT_HELVETICA,
                size: fontSize.medium,
                position: { x: MARGIN_X + x + 19, y: MARGIN_Y + y + 5 },
                options: { width: 80, align: 'left' },
            });
            configureTextContent({
                text: `${2}`,
                font: FONT_HELVETICA,
                size: fontSize.medium,
                position: { x: MARGIN_X + x + 13, y: MARGIN_Y + y + 10 },
                options: { width: 80 },
            });
            configureTextContent({
                text: '3 (4-7) ',
                font: FONT_HELVETICA,
                size: fontSize.medium,
                position: { x: MARGIN_X + x + 20, y: MARGIN_Y + y + 15 },
                options: { width: 80 },
            });
            configureTextContent({
                text: 'Filipino/American ',
                font: FONT_HELVETICA,
                size: fontSize.medium,
                position: { x: MARGIN_X + x + 23, y: MARGIN_Y + y + 20 },
                options: { width: 80 },
            });
            configureTextContent({
                text: new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium',
                    timeZone: 'Asia/Manila',
                }).format(new Date()),
                font: FONT_HELVETICA,
                size: fontSize.medium,
                position: { x: JUSTIFY_END + x - 18, y: MARGIN_Y + y },
                options: { width: 80 },
            });
            configureTextContent({
                text: 'N/A',
                font: FONT_HELVETICA,
                size: fontSize.medium,
                position: { x: MARGIN_X + x + 13, y: MARGIN_Y + y + 25 },
                options: { width: 80 },
            });
            configureTextContent({
                text: '999999989',
                font: FONT_HELVETICA,
                size: fontSize.medium,
                position: { x: MARGIN_X + x + 33, y: MARGIN_Y + y + 30 },
                options: { width: 80 },
            });
            configureTextContent({
                text: `LIO Airport ${new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    timeZone: 'Asia/Manila',
                }).format(new Date())}`,
                font: FONT_HELVETICA,
                size: fontSize.medium,
                position: { x: JUSTIFY_END + x - 30, y: MARGIN_Y + y + 10 },
                options: { width: 80 },
            });
            configureTextContent({
                text: `LIO Airport ${new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    timeZone: 'Asia/Manila',
                }).format(new Date())}`,
                font: FONT_HELVETICA,
                size: fontSize.medium,
                position: { x: JUSTIFY_END + x - 30, y: MARGIN_Y + y + 5 },
                options: { width: 80 },
            });
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
                        renderer: (value) => `P ${new Intl.NumberFormat('en-PH', {
                            currency: 'PHP',
                        }).format(Number(value))}`,
                    },
                ],
                datas: [
                    {
                        date: new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'medium',
                            timeZone: 'Asia/Manila',
                        }).format(new Date()),
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.  ',
                        time: new Intl.DateTimeFormat('en-US', {
                            timeStyle: 'medium',
                            timeZone: 'Asia/Manila',
                        }).format(new Date()),
                        subtotal: '1500',
                    },
                    {
                        date: '',
                        description: '',
                        time: 'GrandTotal',
                        subtotal: '1500',
                    },
                ],
            };
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
        doc.end();
        return doc;
    }
    async generateBookingItinerary(content, id, bucketname) {
        const doc = this.templateBookingItinerary(content, id);
        const buffer = await this.streamToBuffer(doc);
        return {
            bucketname: bucketname || process.env.AWS_S3_BUCKET,
            filename: `itinerary_${id}_${new Date()
                .toLocaleDateString()
                .replaceAll('/', '')}`,
            buffer: buffer,
            mimetype: 'application/pdf',
        };
    }
    templateBookingItinerary(content, ...rest) {
        const doc = new pdfkit_table_1.default({ size: 'A7' });
        doc.fontSize(10).text(content, 5, 5, { align: 'left' });
        doc.fontSize(10).text(rest?.id, 20, 20, { align: 'left' });
        doc.end();
        return doc;
    }
    templateCheckoutReciept(content) {
        const doc = new pdfkit_table_1.default({ size: 'A7' });
        doc.fontSize(23).text(content, 5, 5, { align: 'left' });
        doc.end();
        return doc;
    }
    streamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            const buffer = [];
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
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map