import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { ToursService } from './tours.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import global from '@config/global';
import { S3BucketService } from 'src/middlewares/s3.service';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly toursService: ToursService, private readonly s3Service: S3BucketService) {}

    @Get('/')
    @ApiQuery({ name: 'hasGallery', type: 'Boolean', required: false })
    async getTours(@Query('hasGallery') hasGallery?: boolean): Promise<TResponseData> {
        const cacheKey = `tours${hasGallery ? '-hasGallery' : ''}`;
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
        const tours = await this.toursService.find();
        const galleryImageIds = [...Array(9).keys()].map(i => `image${i + 1}`);
        
        const imaged_tours = await Promise.all(tours.map(async (data) => {
            const { tour_slug, tour_title, tour_banner_image, package_details, price, discount } = data;
                const tour = {
                    tour_slug,
                    tour_title,
                    package_details,
                    price,
                    discount,
                    tour_banner_image: await this.s3Service.getImage(tour_banner_image),
                    gallery: []
                };
                if (hasGallery) tour.gallery = await Promise.all(galleryImageIds.map(async gId => {
                    const galleryImage = await this.s3Service.getImage(data[gId]);
                    return galleryImage;
                }));
                return tour;
            }
        ));

        await this.cacheManager.set(cacheKey, imaged_tours, global.cache.ttl);

        return {
            status: HttpStatus.OK,
            message: 'Tour Retrieved Successfully.',
            data: {
                ...imaged_tours,
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
        const { tour_slug, tour_title, tour_banner_image, package_details, price, discount } = tour;
        const galleryImageIds = [...Array(9).keys()].map(i => `image${i + 1}`);
        const imaged_tour = {
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
        
        await this.cacheManager.set(cacheKey, imaged_tour, global.cache.ttl);

        return {
            status: HttpStatus.OK,
            message: 'Tour Retrieved Successfully.',
            data: {
                ...imaged_tour,
            },
        };
    };
}
