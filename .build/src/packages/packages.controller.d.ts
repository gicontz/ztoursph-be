import { TResponseData } from 'src/http.types';
import { PackagesService } from './packages.service';
import { Cache } from 'cache-manager';
import { S3BucketService } from 'src/middlewares/s3.service';
export declare class PackagesController {
    private cacheManager;
    private readonly packagesService;
    private readonly s3Service;
    private cnfg;
    constructor(cacheManager: Cache, packagesService: PackagesService, s3Service: S3BucketService);
    getPackages(hasGallery?: boolean, hasBanner?: boolean, pageNumber?: number, pageSize?: number): Promise<TResponseData>;
    getPackageBySlug(slug: string): Promise<TResponseData>;
}
