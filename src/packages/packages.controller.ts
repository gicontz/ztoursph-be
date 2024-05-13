import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { PackagesService } from './packages.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import config from '../config/config';
import { S3BucketService } from 'src/middlewares/s3.service';

@ApiTags('Packages')
@Controller('packages')
export class PackagesController {
  private cnfg = config();
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly packagesService: PackagesService,
    private readonly s3Service: S3BucketService,
  ) {}

  @Get('/')
  @ApiQuery({ name: 'hasGallery', type: 'Boolean', required: false })
  @ApiQuery({ name: 'hasBanner', type: 'Boolean', required: false })
  @ApiQuery({ name: 'pageNumber', type: 'Integer', required: false })
  @ApiQuery({ name: 'pageSize', type: 'Integer', required: false })
  async getPackages(
    @Query('hasGallery') hasGallery?: boolean,
    @Query('hasBanner') hasBanner?: boolean,
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<TResponseData> {
    const cacheKey = `packages${
      hasGallery ? '-hasGallery' : ''
    }-${pageSize}-${pageNumber}`;
    const dataFromCache = await this.cacheManager.get(cacheKey);
    if (dataFromCache) {
      return {
        status: HttpStatus.OK,
        message: 'Package Retrieved Successfully.',
        data: {
          ...(dataFromCache as any),
        },
      };
    }
    const packages = await this.packagesService.find({
      pageNumber,
      pageSize,
    });
    const galleryImageIds = [...Array(9).keys()].map((i) => `image${i + 1}`);

    const imaged_packages = await Promise.all(
      packages.records.map(async (data) => {
        const {
          id,
          package_number,
          package_slug,
          package_title,
          thumbnail,
          package_banner_image,
          package_details,
          price,
          discount,
          location_caption,
        } = data;
        const packageInfo = {
          id,
          package_number,
          thumbnail: await this.s3Service.getImage(thumbnail),
          package_slug,
          package_title,
          package_details,
          price,
          discount,
          package_banner_image: '',
          gallery: [],
          location_caption,
        };
        if (hasGallery)
          packageInfo.gallery = await Promise.all(
            galleryImageIds.map(async (gId) => {
              const galleryImage = await this.s3Service.getImage(data[gId]);
              return galleryImage;
            }),
          );
        if (hasBanner)
          packageInfo.package_banner_image =
            await this.s3Service.getImage(package_banner_image);
        return packageInfo;
      }),
    );

    await this.cacheManager.set(
      cacheKey,
      { records: [...imaged_packages], totalRecords: packages.totalRecords },
      this.cnfg.cache.ttl,
    );

    return {
      status: HttpStatus.OK,
      message: 'Package Retrieved Successfully.',
      data: {
        records: [...imaged_packages],
        totalRecords: packages.totalRecords,
      },
    };
  }

  @Get('/info')
  @ApiQuery({ name: 'package_slug', type: 'String', required: true })
  async getPackageBySlug(
    @Query('package_slug') slug: string,
  ): Promise<TResponseData> {
    const cacheKey = `package-info-${slug}`;
    const dataFromCache = await this.cacheManager.get(cacheKey);
    if (dataFromCache)
      return {
        status: HttpStatus.OK,
        message: 'Package Retrieved Successfully.',
        data: { ...(dataFromCache as any) },
      };
    const packageInfo = await this.packagesService.findOne(slug);
    if (!packageInfo)
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Package Not Found',
      };
    const {
      id,
      package_slug,
      package_title,
      package_banner_image,
      thumbnail,
      package_details,
      price,
      discount,
    } = packageInfo;
    const galleryImageIds = [...Array(9).keys()].map((i) => `image${i + 1}`);
    const imaged_package = {
      id,
      thumbnail: await this.s3Service.getImage(thumbnail),
      package_slug,
      package_title,
      package_details,
      price,
      discount,
      package_banner_image: await this.s3Service.getImage(package_banner_image),
      gallery: await Promise.all(
        galleryImageIds.map(async (gId) => {
          const galleryImage = await this.s3Service.getImage(packageInfo[gId]);
          return galleryImage;
        }),
      ),
    };

    await this.cacheManager.set(cacheKey, imaged_package, this.cnfg.cache.ttl);

    return {
      status: HttpStatus.OK,
      message: 'Package Retrieved Successfully.',
      data: {
        ...imaged_package,
      },
    };
  }
}
