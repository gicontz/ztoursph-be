import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { BookingsService } from './bookings.service';
import { S3BucketService } from 'src/middlewares/s3.service';
import { Cache } from 'cache-manager';
import { PdfService } from 'src/pdf/pdf.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly bookingService: BookingsService,
    private readonly s3Service: S3BucketService,
    private readonly s3ServiceMiddleware: S3Service,
    private readonly generateItinerary: PdfService,
  ) {}

  @Post('/info')
  @ApiBody({ required: true })
  async createBooking(
    @Body('booking') booking: { id: string },
  ): Promise<TResponseData> {
    const bookingId = booking.id;
    try {
      const bookingInfo = await this.bookingService.findOne(bookingId);

      // Return as object and generate the buffer
      const itinerary = this.generateItinerary.generateBookingItinerary(
        bookingInfo,
        bookingId,
      );

      // Upload the itinerary to s3bucket

      const pdfFile = await this.s3ServiceMiddleware.uploadFiles([itinerary]);

      // Create a uri to that specific s3 file
      const itineraryFileUri = await this.s3Service.getPDF(pdfFile);

      return {
        status: HttpStatus.OK,
        message: 'Booking Information has been retrieved',
        data: { ...bookingInfo, itineraryFileUri },
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Booking Information not be able to retrieved',
      };
    }
  }
}
