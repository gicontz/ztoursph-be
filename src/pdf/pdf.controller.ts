import { Body, Controller, Post, Query, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
import { S3BucketService } from 'src/middlewares/s3.service';
import { TPDFItenerary } from './pdf.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { ToursService } from 'src/tours/tours.service';
import { PackagesService } from 'src/packages/packages.service';
import { example1 } from 'src/examples/pdf';
import { BookingsService } from 'src/bookings/bookings.service';
import { UsersService } from 'src/users/users.service';

@ApiTags('Itinerary')
@Controller('itinerary')
export class PdfController {
  constructor(
    private readonly PDFService: PdfService,
    private readonly s3Service: S3Service,
    private readonly seServiceBucket: S3BucketService,
    private readonly toursService: ToursService,
    private readonly packageService: PackagesService,
    private readonly bookingService: BookingsService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @ApiBody({
    required: true,
    type: TPDFItenerary,
    examples: {
      example1,
    },
  })
  @ApiQuery({ name: 'upload', type: Boolean, required: false })
  async getItinerary(
    @Body() body: { content: TPDFItenerary },
    @Query('upload') upload?: 'true' | 'false',
    @Res() res?: ExpressResponse,
  ) {
    const fileName = `Itinerary-${Date.now()}-${body.content.lastName}.pdf`;
    const booked_tours = body.content.booked_tours;

    const tourIds = booked_tours
      .map((tour) => (typeof tour.id === 'number' ? tour.id : undefined))
      .filter(Boolean);

    const packageIds = booked_tours
      .map((tour) => (typeof tour.id === 'string' ? tour.id : undefined))
      .filter(Boolean);

    const toursInfo = await this.toursService.findByIds(tourIds);
    const packagesInfo = await this.packageService.findByIds(packageIds);

    const allTours = [...toursInfo, ...packagesInfo];

    const totalAmts = await this.bookingService.calculateTotalAmts({
      booking: booked_tours.map((p) => ({
        id: p.id,
        pax: p.pax,
        ages: body.content.guests[p.id]
          .filter(({ id }) => p.participants.includes(id))
          .map(({ age }) => age),
      })),
    });

    const btWithTime = booked_tours.map((tour) => ({
      ...tour,
      // title: allTours.find((t) => t.id === tour.id).tour_title,
      pickup_time: allTours.find((t) => t.id === tour.id)?.pickup_time,
      subtotal: totalAmts.subTotals
        .find(({ id }) => id === tour.id)
        .subTotal.toString(),
    }));

    const pdf = await this.PDFService.generateItenerary(
      {
        ...body.content,
        booked_tours: btWithTime,
        grandTotal: totalAmts.totalAmtTbp,
        fees: totalAmts.processingFee,
      },
      fileName,
    );

    if (upload === 'true') {
      try {
        await this.s3Service.uploadFiles([pdf]);
        const uploadedPdf = await this.seServiceBucket.getPDF(fileName);
        return res.status(201).send(uploadedPdf);
      } catch (error) {
        console.error('Error uploading PDF:', error);
        return res.status(500).send({ message: 'Failed to upload PDF' });
      }
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );
      return res.status(201).send(pdf.buffer);
    }
  }

  @Post('/details')
  @ApiQuery({ name: 'reference_id', required: true, type: 'string' })
  @ApiQuery({ name: 'email', required: true, type: 'string' })
  async getPackageDetails(
    @Query('reference_id') reference_id: string,
    @Query('email') email: string,
    @Res() res?: ExpressResponse,
  ) {
    const userInfo = await this.userService.findOne({ email });
    const booking_info = await this.bookingService.findByRef({
      reference_id: reference_id.toLowerCase(),
      user_id: userInfo.id,
    });
    const theIds = JSON.parse(booking_info.packages).map((p) => p.tripId);
    const packageIds = theIds.filter((d: string) => d.length === 36);
    const tourIds = theIds
      .filter((d: string) => d.length !== 36)
      .map((d) => parseInt(d, 10));

    const toursInfo = await this.toursService.findByIds(tourIds);
    const packagesInfo = await this.packageService.findByIds(packageIds);

    const allTours = [
      ...toursInfo.map((t) => ({
        title: t.tour_title,
        content: t.package_details,
      })),
      ...packagesInfo.map((p) => ({
        title: p.package_title,
        content: p.package_details,
      })),
    ];

    const fileName = `Package-Details-${reference_id}.pdf`;

    const pdf = await this.PDFService.generateTourDetails(allTours, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.status(201).send(pdf.buffer);
  }
}
