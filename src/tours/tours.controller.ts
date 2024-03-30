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
import { ToursService } from './tours.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import config from '../config/config';
import { S3BucketService } from 'src/middlewares/s3.service';
import { PackagesService } from 'src/packages/packages.service';
import { TGetTrips } from './tours.dto';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
  private cnfg = config();
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly toursService: ToursService,
    private readonly packageService: PackagesService,
    private readonly s3Service: S3BucketService,
  ) {}

  @Get('/')
  @ApiQuery({ name: 'hasGallery', type: 'Boolean', required: false })
  @ApiQuery({ name: 'hasBanner', type: 'Boolean', required: false })
  @ApiQuery({ name: 'pageNumber', type: 'Integer', required: false })
  @ApiQuery({ name: 'pageSize', type: 'Integer', required: false })
  async getTours(
    @Query('hasGallery') hasGallery?: boolean,
    @Query('hasBanner') hasBanner?: boolean,
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<TResponseData> {
    const cacheKey = `tours${
      hasGallery ? '-hasGallery' : ''
    }-${pageSize}-${pageNumber}`;
    const dataFromCache = await this.cacheManager.get(cacheKey);
    if (dataFromCache) {
      return {
        status: HttpStatus.NOT_MODIFIED,
        message: 'Tour Retrieved Successfully.',
        data: { ...(dataFromCache as any) },
      };
    }
    const tours = await this.toursService.find({
      pageNumber,
      pageSize,
    });
    const galleryImageIds = [...Array(9).keys()].map((i) => `image${i + 1}`);

    const imaged_tours = await Promise.all(
      tours.records.map(async (data) => {
        const {
          id,
          tour_slug,
          tour_title,
          thumbnail,
          tour_banner_image,
          package_details,
          price,
          discount,
          pickup_time,
        } = data;
        const tour = {
          id,
          thumbnail: await this.s3Service.getImage(thumbnail),
          tour_slug,
          tour_title,
          package_details,
          price,
          discount,
          pickup_time,
          tour_banner_image: '',
          gallery: [],
        };
        if (hasGallery)
          tour.gallery = await Promise.all(
            galleryImageIds.map(async (gId) => {
              const galleryImage = await this.s3Service.getImage(data[gId]);
              return galleryImage;
            }),
          );
        if (hasBanner)
          tour.tour_banner_image =
            await this.s3Service.getImage(tour_banner_image);
        return tour;
      }),
    );

    await this.cacheManager.set(
      cacheKey,
      { records: [...imaged_tours], totalRecords: tours.totalRecords },
      this.cnfg.cache.ttl,
    );

    return {
      status: HttpStatus.OK,
      message: 'Tour Retrieved Successfully.',
      data: {
        records: [...imaged_tours],
        totalRecords: tours.totalRecords,
      },
    };
  }

  @Get('/info')
  @ApiQuery({ name: 'tour_slug', type: 'String', required: true })
  async getTourBySlug(
    @Query('tour_slug') slug: string,
  ): Promise<TResponseData> {
    const cacheKey = `tour-info-${slug}`;
    const dataFromCache = await this.cacheManager.get(cacheKey);
    if (dataFromCache)
      return {
        status: HttpStatus.OK,
        message: 'Tour Retrieved Successfully.',
        data: { ...(dataFromCache as any) },
      };
    const tour = await this.toursService.findOne(slug);
    if (!tour)
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Tour Not Found',
      };
    const {
      id,
      tour_slug,
      tour_title,
      tour_banner_image,
      thumbnail,
      pickup_time,
      package_details,
      price,
      discount,
    } = tour;
    const galleryImageIds = [...Array(9).keys()].map((i) => `image${i + 1}`);
    const imaged_tour = {
      id,
      thumbnail: await this.s3Service.getImage(thumbnail),
      tour_slug,
      tour_title,
      package_details,
      price,
      discount,
      pickup_time,
      tour_banner_image: await this.s3Service.getImage(tour_banner_image),
      gallery: await Promise.all(
        galleryImageIds.map(async (gId) => {
          const galleryImage = await this.s3Service.getImage(tour[gId]);
          return galleryImage;
        }),
      ),
    };

    await this.cacheManager.set(cacheKey, imaged_tour, this.cnfg.cache.ttl);

    return {
      status: HttpStatus.OK,
      message: 'Tour Retrieved Successfully.',
      data: {
        ...imaged_tour,
      },
    };
  }

  @Post('/trips')
  @ApiQuery({ name: 'showThumbnail', type: 'Boolean', required: false })
  @ApiBody({
    type: TGetTrips,
    required: false,
    examples: {
      example1: {
        value: { ids: [1] },
        description: 'Array of trip ids from tours and packages',
      },
    },
  })
  async getTrips(
    @Body() data: { ids: Array<string | number> },
    @Query('showThumbnail') showThumbnail: boolean,
  ): Promise<TResponseData> {
    if (!data.ids || data.ids.length === 0)
      return {
        status: HttpStatus.OK,
        message: 'Tour Retrieved Successfully.',
        data: {
          records: [],
          totalRecords: 0,
        },
      };

    const ids = data.ids.length > 0 ? data.ids.join('-') : undefined;
    const cacheKey = `trips${ids ? `-${ids}` : ''}-${showThumbnail}`;
    const dataFromCache = await this.cacheManager.get(cacheKey);

    if (dataFromCache) {
      return {
        status: HttpStatus.OK,
        message: 'Tour Retrieved Successfully.',
        data: {
          ...(dataFromCache as any),
        },
      };
    }
    const tours = await this.toursService.findByIds(data.ids as number[]);
    const packages = await this.packageService.findByIds(data.ids as string[]);
    const trips = [
      ...tours.map((t) => ({ ...t, title: t.tour_title })),
      ...packages.map((p) => ({ ...p, title: p.package_title })),
    ];

    const imaged_trips = await Promise.all(
      trips.map(async (data) => {
        const {
          id,
          thumbnail,
          title,
          package_details,
          price,
          pickup_time,
          discount,
        } = data;
        const tour = {
          id,
          thumbnail: showThumbnail
            ? await this.s3Service.getImage(thumbnail)
            : '',
          title,
          package_details,
          price,
          pickup_time,
          discount,
        };
        return tour;
      }),
    );
    await this.cacheManager.set(
      cacheKey,
      { records: imaged_trips, totalRecords: imaged_trips.length },
      this.cnfg.cache.ttl,
    );

    return {
      status: HttpStatus.OK,
      message: 'Trips Retrieved Successfully.',
      data: {
        records: imaged_trips,
        totalRecords: imaged_trips.length,
      },
    };
  }
}
