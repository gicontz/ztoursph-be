"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsModule = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const s3_service_1 = require("src/middlewares/s3.service");
const s3_object_1 = require("src/third-party/aws-sdk/s3.object");
const bookings_model_1 = require("./bookings.model");
const cache_manager_1 = require("@nestjs/cache-manager");
const typeorm_1 = require("@nestjs/typeorm");
const bookings_controller_1 = require("./bookings.controller");
const pdf_service_1 = require("src/pdf/pdf.service");
let BookingsModule = class BookingsModule {
};
exports.BookingsModule = BookingsModule;
exports.BookingsModule = BookingsModule = __decorate([
    (0, common_1.Module)({
        providers: [bookings_service_1.BookingsService, s3_object_1.S3Service, s3_service_1.S3BucketService, pdf_service_1.PdfService],
        imports: [cache_manager_1.CacheModule.register(), typeorm_1.TypeOrmModule.forFeature([bookings_model_1.BookingModel])],
        exports: [bookings_service_1.BookingsService],
        controllers: [bookings_controller_1.BookingsController],
    })
], BookingsModule);
//# sourceMappingURL=bookings.module.js.map