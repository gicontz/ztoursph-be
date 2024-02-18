import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Body, Controller, Get, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { BookingsService } from './bookings.service';
import { S3BucketService } from 'src/middlewares/s3.service';
import { Cache } from 'cache-manager';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache, 
        private readonly bookingService: BookingsService, 
        private readonly s3Service: S3BucketService) {}

    @Post('/info')
    @ApiBody({ required: true })
    async getPackageBySlug(@Body('booking') booking: { id: string }): Promise<TResponseData> {
        const bookingId = booking.id;
        try {
            const bookingInfo = await this.bookingService.findOne(bookingId);
            return {
                status: HttpStatus.OK,
                message: 'Booking Information has been retrieved',
                data: { ...bookingInfo }
            }
        } catch (e) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'Booking Information not be able to retrieved',
            }
        }

    }
}
