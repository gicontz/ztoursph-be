import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { ToursService } from './tours.service';
import { S3Service } from 'src/aws-sdk/s3.object';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
    constructor(private readonly toursService: ToursService, private readonly s3Service: S3Service) {}

    @Get('/')
    @ApiQuery({ name: 'hasGallery', type: 'Boolean', required: false })
    async getTours(@Query('hasGallery') hasGallery?: boolean): Promise<TResponseData> {
        const BUCKET_NAME = process.env.AWS_S3_BUCKET;
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
                    tour_banner_image: await this.s3Service.getFileURI(tour_banner_image, BUCKET_NAME),
                    gallery: []
                };
                if (hasGallery) tour.gallery = await Promise.all(galleryImageIds.map(async gId => {
                    const galleryImage = await this.s3Service.getFileURI(data[gId], BUCKET_NAME);
                    return galleryImage;
                }))
            }
        ));

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
        const BUCKET_NAME = process.env.AWS_S3_BUCKET;
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
                    tour_banner_image: await this.s3Service.getFileURI(tour_banner_image, BUCKET_NAME),
                    gallery: await Promise.all(galleryImageIds.map(async gId => {
                        const galleryImage = await this.s3Service.getFileURI(tour[gId], BUCKET_NAME);
                        return galleryImage;
                    }))
                };

        return {
            status: HttpStatus.OK,
            message: 'Tour Retrieved Successfully.',
            data: {
                ...imaged_tour,
            },
        };
    };
}
