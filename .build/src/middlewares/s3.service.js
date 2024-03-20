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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3BucketService = void 0;
const common_1 = require("@nestjs/common");
const s3_object_1 = require("src/third-party/aws-sdk/s3.object");
let S3BucketService = class S3BucketService {
    constructor(s3Service) {
        this.s3Service = s3Service;
        this.BUCKET_NAME = process.env.AWS_S3_BUCKET;
    }
    async getImage(Key) {
        const image = await this.s3Service.getFileURI(Key, this.BUCKET_NAME);
        return image;
    }
    async getPDF(Key) {
        return this.getImage(Key);
    }
};
exports.S3BucketService = S3BucketService;
exports.S3BucketService = S3BucketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [s3_object_1.S3Service])
], S3BucketService);
//# sourceMappingURL=s3.service.js.map