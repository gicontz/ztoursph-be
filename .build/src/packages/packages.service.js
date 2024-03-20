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
exports.PackagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const packages_model_1 = require("./packages.model");
const typeorm_2 = require("typeorm");
let PackagesService = class PackagesService {
    constructor(packageRepository) {
        this.packageRepository = packageRepository;
    }
    async find(options) {
        let result = [];
        let totalRecords = 0;
        const { searchText, pageNumber, pageSize } = options;
        if (pageNumber && pageSize) {
            const [data, total] = await this.packageRepository
                .createQueryBuilder()
                .orderBy('package_slug', 'ASC')
                .skip((pageNumber - 1) * pageSize)
                .take(pageSize)
                .getManyAndCount();
            result = [...data];
            totalRecords = total;
        }
        else {
            result = (await this.packageRepository.find());
        }
        if (searchText) {
            const filteredResult = result.filter((user) => {
                return JSON.stringify(user).toLowerCase().includes(searchText.toLowerCase());
            });
            return {
                records: [...filteredResult],
                totalRecords
            };
        }
        return {
            records: [...result],
            totalRecords
        };
        ;
    }
    findOne(slug) {
        return this.packageRepository.findOneBy({ package_slug: slug });
    }
};
exports.PackagesService = PackagesService;
exports.PackagesService = PackagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(packages_model_1.PackageModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PackagesService);
//# sourceMappingURL=packages.service.js.map