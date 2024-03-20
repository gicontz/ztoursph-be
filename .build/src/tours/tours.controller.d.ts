import { TResponseData } from 'src/http.types';
import { ToursService } from './tours.service';
import { Cache } from 'cache-manager';
import { S3BucketService } from 'src/middlewares/s3.service';
export declare class ToursController {
    private cacheManager;
    private readonly toursService;
    private readonly s3Service;
    private cnfg;
    constructor(cacheManager: Cache, toursService: ToursService, s3Service: S3BucketService);
    getTours(hasGallery?: boolean, hasBanner?: boolean, pageNumber?: number, pageSize?: number): Promise<TResponseData>;
    getTourBySlug(slug: string): Promise<TResponseData>;
}
