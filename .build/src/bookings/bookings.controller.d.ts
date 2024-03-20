import { TResponseData } from 'src/http.types';
import { BookingsService } from './bookings.service';
import { S3BucketService } from 'src/middlewares/s3.service';
import { Cache } from 'cache-manager';
import { PdfService } from 'src/pdf/pdf.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
export declare class BookingsController {
    private cacheManager;
    private readonly bookingService;
    private readonly s3Service;
    private readonly s3ServiceMiddleware;
    private readonly generateItinerary;
    constructor(cacheManager: Cache, bookingService: BookingsService, s3Service: S3BucketService, s3ServiceMiddleware: S3Service, generateItinerary: PdfService);
    createBooking(booking: {
        id: string;
    }): Promise<TResponseData>;
}
