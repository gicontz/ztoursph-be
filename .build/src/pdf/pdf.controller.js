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
exports.PdfController = void 0;
const common_1 = require("@nestjs/common");
const pdf_service_1 = require("./pdf.service");
const s3_object_1 = require("src/third-party/aws-sdk/s3.object");
const s3_service_1 = require("src/middlewares/s3.service");
let PdfController = class PdfController {
    constructor(PDFService, s3Service, seServiceBucket) {
        this.PDFService = PDFService;
        this.s3Service = s3Service;
        this.seServiceBucket = seServiceBucket;
    }
    async getTest(body) {
        const pdf = await this.PDFService.generatePDF(body.title, body.title);
        await this.s3Service.uploadFiles([pdf]);
        return this.seServiceBucket.getPDF(pdf.filename);
    }
};
exports.PdfController = PdfController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "getTest", null);
exports.PdfController = PdfController = __decorate([
    (0, common_1.Controller)('pdf'),
    __metadata("design:paramtypes", [pdf_service_1.PdfService,
        s3_object_1.S3Service,
        s3_service_1.S3BucketService])
], PdfController);
//# sourceMappingURL=pdf.controller.js.map