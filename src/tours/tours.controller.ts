import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { ToursService } from './tours.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import config from '../config/config';
import { S3BucketService } from 'src/middlewares/s3.service';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
    private cnfg = config();
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly toursService: ToursService, private readonly s3Service: S3BucketService) {}

    @Get('/')
    @ApiQuery({ name: 'hasGallery', type: 'Boolean', required: false })
    @ApiQuery({ name: 'hasBanner', type: 'Boolean', required: false })
    @ApiQuery({ name: 'pageNumber', type: 'Integer', required: false })
    @ApiQuery({ name: 'pageSize', type: 'Integer', required: false })
    async getTours(@Query('hasGallery') hasGallery?: boolean, @Query('hasBanner') hasBanner?: boolean, @Query('pageNumber') pageNumber?: number, @Query('pageSize') pageSize?: number): Promise<TResponseData> {
        const cacheKey = `tours${hasGallery ? '-hasGallery' : ''}-${pageSize}-${pageNumber}`;
        const dataFromCache = await this.cacheManager.get(cacheKey);
        if (dataFromCache) {
            return {
                status: HttpStatus.OK,
                message: 'Tour Retrieved Successfully.',
                data: {
                    ...dataFromCache as any,
                },
            };
        }
        const tours = await this.toursService.find({
            pageNumber,
            pageSize
        });
        const galleryImageIds = [...Array(9).keys()].map(i => `image${i + 1}`);
        
        const imaged_tours = await Promise.all(tours.records.map(async (data) => {
            const { id, tour_slug, tour_title, thumbnail, tour_banner_image, package_details, price, discount } = data;
                const tour = {
                    id,
                    thumbnail: await this.s3Service.getImage(thumbnail),
                    tour_slug,
                    tour_title,
                    package_details,
                    price,
                    discount,
                    tour_banner_image: '',
                    gallery: []
                };
                if (hasGallery) tour.gallery = await Promise.all(galleryImageIds.map(async gId => {
                    const galleryImage = await this.s3Service.getImage(data[gId]);
                    return galleryImage;
                }));
                if (hasBanner) tour.tour_banner_image = await this.s3Service.getImage(tour_banner_image);
                return tour;
            }
        ));

        await this.cacheManager.set(cacheKey, imaged_tours, this.cnfg.cache.ttl);

        return {
            status: HttpStatus.OK,
            message: 'Tour Retrieved Successfully.',
            data: {
                records: [...imaged_tours],
                totalRecords: tours.totalRecords,
            },
        };
    };

    @Get('/info')
    @ApiQuery({ name: 'tour_slug', type: 'String', required: true })
    async getTourBySlug(@Query('tour_slug') slug: string): Promise<TResponseData> {
        const cacheKey = `tour-info-${slug}`;
        const dataFromCache = await this.cacheManager.get(cacheKey);
        if (dataFromCache) return {
            status: HttpStatus.OK,
            message: 'Tour Retrieved Successfully.',
            data: { ...dataFromCache as any}
        }
        const tour = await this.toursService.findOne(slug);
        if (!tour) return {
            status: HttpStatus.NOT_FOUND,
            message: 'Tour Not Found',
        }
        const { id, tour_slug, tour_title, tour_banner_image, thumbnail, package_details, price, discount } = tour;
        const galleryImageIds = [...Array(9).keys()].map(i => `image${i + 1}`);
        const imaged_tour = {
                    id,
                    thumbnail: await this.s3Service.getImage(thumbnail),
                    tour_slug,
                    tour_title,
                    package_details,
                    price,
                    discount,
                    tour_banner_image: await this.s3Service.getImage(tour_banner_image),
                    gallery: await Promise.all(galleryImageIds.map(async gId => {
                        const galleryImage = await this.s3Service.getImage(tour[gId]);
                        return galleryImage;
                    }))
                };
        
        await this.cacheManager.set(cacheKey, imaged_tour, this.cnfg.cache.ttl);

        return {
            status: HttpStatus.OK,
            message: 'Tour Retrieved Successfully.',
            data: {
                ...imaged_tour,
            },
        };
    };
}
