"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const packages_service_1 = require("./packages.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@config/config");
const s3_service_1 = require("src/middlewares/s3.service");
let PackagesController = class PackagesController {
    constructor(cacheManager, packagesService, s3Service) {
        this.cacheManager = cacheManager;
        this.packagesService = packagesService;
        this.s3Service = s3Service;
        this.cnfg = (0, config_1.default)();
    }
    async getPackages(hasGallery, hasBanner, pageNumber, pageSize) {
        const cacheKey = `packages${hasGallery ? '-hasGallery' : ''}-${pageSize}-${pageNumber}`;
        const dataFromCache = await this.cacheManager.get(cacheKey);
        if (dataFromCache) {
            return {
                status: common_1.HttpStatus.OK,
                message: 'Package Retrieved Successfully.',
                data: {
                    ...dataFromCache,
                },
            };
        }
        const packages = await this.packagesService.find({
            pageNumber,
            pageSize
        });
        const galleryImageIds = [...Array(9).keys()].map(i => `image${i + 1}`);
        const imaged_packages = await Promise.all(packages.records.map(async (data) => {
            const { id, package_number, package_slug, package_title, thumbnail, package_banner_image, package_details, price, discount } = data;
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
                gallery: []
            };
            if (hasGallery)
                packageInfo.gallery = await Promise.all(galleryImageIds.map(async (gId) => {
                    const galleryImage = await this.s3Service.getImage(data[gId]);
                    return galleryImage;
                }));
            if (hasBanner)
                packageInfo.package_banner_image = await this.s3Service.getImage(package_banner_image);
            return packageInfo;
        }));
        await this.cacheManager.set(cacheKey, imaged_packages, this.cnfg.cache.ttl);
        return {
            status: common_1.HttpStatus.OK,
            message: 'Package Retrieved Successfully.',
            data: {
                records: [...imaged_packages],
                totalRecords: packages.totalRecords,
            },
        };
    }
    ;
    async getPackageBySlug(slug) {
        const cacheKey = `package-info-${slug}`;
        const dataFromCache = await this.cacheManager.get(cacheKey);
        if (dataFromCache)
            return {
                status: common_1.HttpStatus.OK,
                message: 'Package Retrieved Successfully.',
                data: { ...dataFromCache }
            };
        const packageInfo = await this.packagesService.findOne(slug);
        if (!packageInfo)
            return {
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'Package Not Found',
            };
        const { id, package_slug, package_title, package_banner_image, thumbnail, package_details, price, discount } = packageInfo;
        const galleryImageIds = [...Array(9).keys()].map(i => `image${i + 1}`);
        const imaged_package = {
            id,
            thumbnail: await this.s3Service.getImage(thumbnail),
            package_slug,
            package_title,
            package_details,
            price,
            discount,
            package_banner_image: await this.s3Service.getImage(package_banner_image),
            gallery: await Promise.all(galleryImageIds.map(async (gId) => {
                const galleryImage = await this.s3Service.getImage(packageInfo[gId]);
                return galleryImage;
            }))
        };
        await this.cacheManager.set(cacheKey, imaged_package, this.cnfg.cache.ttl);
        return {
            status: common_1.HttpStatus.OK,
            message: 'Package Retrieved Successfully.',
            data: {
                ...imaged_package,
            },
        };
    }
    ;
};
exports.PackagesController = PackagesController;
__decorate([
    (0, common_1.Get)('/'),
    (0, swagger_1.ApiQuery)({ name: 'hasGallery', type: 'Boolean', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'hasBanner', type: 'Boolean', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', type: 'Integer', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', type: 'Integer', required: false }),
    __param(0, (0, common_1.Query)('hasGallery')),
    __param(1, (0, common_1.Query)('hasBanner')),
    __param(2, (0, common_1.Query)('pageNumber')),
    __param(3, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], PackagesController.prototype, "getPackages", null);
__decorate([
    (0, common_1.Get)('/info'),
    (0, swagger_1.ApiQuery)({ name: 'package_slug', type: 'String', required: true }),
    __param(0, (0, common_1.Query)('package_slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PackagesController.prototype, "getPackageBySlug", null);
exports.PackagesController = PackagesController = __decorate([
    (0, swagger_1.ApiTags)('Packages'),
    (0, common_1.Controller)('packages'),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, packages_service_1.PackagesService, s3_service_1.S3BucketService])
], PackagesController);
//# sourceMappingURL=packages.controller.js.map