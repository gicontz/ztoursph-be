import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { BookingsService } from './bookings.service';
import { S3BucketService } from 'src/middlewares/s3.service';
import { Cache } from 'cache-manager';
import { PdfService } from 'src/pdf/pdf.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
import { UsersService } from 'src/users/users.service';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly bookingService: BookingsService,
    private readonly s3Service: S3BucketService,
    private readonly s3ServiceMiddleware: S3Service,
    private readonly generateItinerary: PdfService,
    private readonly userService: UsersService,
  ) {}

  @Post('/info')
  @ApiBody({
    required: true,
    examples: {
      example1: {
        value: {
          booking: {
            id: 'not required',
            email: 'string',
            reference_id: 'string',
          },
        },
      },
    },
  })
  async getBooking(
    @Body('booking')
    booking: {
      email?: string;
      reference_id?: string;
    },
  ): Promise<TResponseData> {
    try {
      const userInfo = await this.userService.findOne({ email: booking.email });
      const bookingInfo = await this.bookingService.findByRef({
        user_id: userInfo.id,
        reference_id: booking.reference_id.toLowerCase(),
      });
      const user = await this.userService.findOne({ id: bookingInfo.user_id });
      const itineraryUri = await this.s3Service.getPDF(bookingInfo.itinerary);
      // Do not expose db ids
      delete bookingInfo.id;
      delete bookingInfo.user_id;
      delete user.id;

      return {
        status: HttpStatus.OK,
        message: 'Booking Information has been retrieved',
        data: { ...bookingInfo, mainGuest: { ...user }, itineraryUri },
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Booking Information not be able to retrieved',
      };
    }
  }

  @Get('/')
  @ApiQuery({ name: 'userEmail', required: true })
  async getBookings(
    @Query('userEmail') userEmail: string,
  ): Promise<TResponseData> {
    try {
      const user = await this.userService.findOne({ email: userEmail });
      const bookings = await this.bookingService.findAll(user.id);

      return {
        status: HttpStatus.OK,
        message: 'Bookings Information has been retrieved',
        data: bookings,
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bookings Information not be able to retrieved',
      };
    }
  }
}
