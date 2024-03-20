import { PdfService } from './pdf.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
import { S3BucketService } from 'src/middlewares/s3.service';
export declare class PdfController {
    private readonly PDFService;
    private readonly s3Service;
    private readonly seServiceBucket;
    constructor(PDFService: PdfService, s3Service: S3Service, seServiceBucket: S3BucketService);
    getTest(body: {
        title: string;
    }): Promise<string>;
}
