export declare class PdfService {
    generatePDF(content: string, filename: string, bucketname?: string | undefined): Promise<any>;
    private templatePDFDocument;
    generateBookingItinerary(content: any, id: string, bucketname?: string | undefined): Promise<any>;
    private templateBookingItinerary;
    private templateCheckoutReciept;
    private streamToBuffer;
}
