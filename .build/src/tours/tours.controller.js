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
exports.ToursController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tours_service_1 = require("./tours.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@config/config");
const s3_service_1 = require("src/middlewares/s3.service");
let ToursController = class ToursController {
    constructor(cacheManager, toursService, s3Service) {
        this.cacheManager = cacheManager;
        this.toursService = toursService;
        this.s3Service = s3Service;
        this.cnfg = (0, config_1.default)();
    }
    async getTours(hasGallery, hasBanner, pageNumber, pageSize) {
        const cacheKey = `tours${hasGallery ? '-hasGallery' : ''}-${pageSize}-${pageNumber}`;
        const dataFromCache = await this.cacheManager.get(cacheKey);
        if (dataFromCache) {
            return {
                status: common_1.HttpStatus.OK,
                message: 'Tour Retrieved Successfully.',
                data: {
                    ...dataFromCache,
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
            if (hasGallery)
                tour.gallery = await Promise.all(galleryImageIds.map(async (gId) => {
                    const galleryImage = await this.s3Service.getImage(data[gId]);
                    return galleryImage;
                }));
            if (hasBanner)
                tour.tour_banner_image = await this.s3Service.getImage(tour_banner_image);
            return tour;
        }));
        await this.cacheManager.set(cacheKey, imaged_tours, this.cnfg.cache.ttl);
        return {
            status: common_1.HttpStatus.OK,
            message: 'Tour Retrieved Successfully.',
            data: {
                records: [...imaged_tours],
                totalRecords: tours.totalRecords,
            },
        };
    }
    ;
    async getTourBySlug(slug) {
        const cacheKey = `tour-info-${slug}`;
        const dataFromCache = await this.cacheManager.get(cacheKey);
        if (dataFromCache)
            return {
                status: common_1.HttpStatus.OK,
                message: 'Tour Retrieved Successfully.',
                data: { ...dataFromCache }
            };
        const tour = await this.toursService.findOne(slug);
        if (!tour)
            return {
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'Tour Not Found',
            };
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
            gallery: await Promise.all(galleryImageIds.map(async (gId) => {
                const galleryImage = await this.s3Service.getImage(tour[gId]);
                return galleryImage;
            }))
        };
        await this.cacheManager.set(cacheKey, imaged_tour, this.cnfg.cache.ttl);
        return {
            status: common_1.HttpStatus.OK,
            message: 'Tour Retrieved Successfully.',
            data: {
                ...imaged_tour,
            },
        };
    }
    ;
};
exports.ToursController = ToursController;
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
], ToursController.prototype, "getTours", null);
__decorate([
    (0, common_1.Get)('/info'),
    (0, swagger_1.ApiQuery)({ name: 'tour_slug', type: 'String', required: true }),
    __param(0, (0, common_1.Query)('tour_slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "getTourBySlug", null);
exports.ToursController = ToursController = __decorate([
    (0, swagger_1.ApiTags)('Tours'),
    (0, common_1.Controller)('tours'),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, tours_service_1.ToursService, s3_service_1.S3BucketService])
], ToursController);
//# sourceMappingURL=tours.controller.js.map