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
exports.BookingsController = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bookings_service_1 = require("./bookings.service");
const s3_service_1 = require("src/middlewares/s3.service");
const pdf_service_1 = require("src/pdf/pdf.service");
const s3_object_1 = require("src/third-party/aws-sdk/s3.object");
let BookingsController = class BookingsController {
    constructor(cacheManager, bookingService, s3Service, s3ServiceMiddleware, generateItinerary) {
        this.cacheManager = cacheManager;
        this.bookingService = bookingService;
        this.s3Service = s3Service;
        this.s3ServiceMiddleware = s3ServiceMiddleware;
        this.generateItinerary = generateItinerary;
    }
    async createBooking(booking) {
        const bookingId = booking.id;
        try {
            const bookingInfo = await this.bookingService.findOne(bookingId);
            const itinerary = this.generateItinerary.generateBookingItinerary(bookingInfo, bookingId);
            const pdfFile = await this.s3ServiceMiddleware.uploadFiles([itinerary]);
            const itineraryFileUri = await this.s3Service.getPDF(pdfFile);
            return {
                status: common_1.HttpStatus.OK,
                message: 'Booking Information has been retrieved',
                data: { ...bookingInfo, itineraryFileUri },
            };
        }
        catch (e) {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Booking Information not be able to retrieved',
            };
        }
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)('/info'),
    (0, swagger_1.ApiBody)({ required: true }),
    __param(0, (0, common_1.Body)('booking')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "createBooking", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('Bookings'),
    (0, common_1.Controller)('bookings'),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, bookings_service_1.BookingsService,
        s3_service_1.S3BucketService,
        s3_object_1.S3Service,
        pdf_service_1.PdfService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map