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
exports.ToursService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tours_model_1 = require("./tours.model");
const typeorm_2 = require("typeorm");
let ToursService = class ToursService {
    constructor(tourRepository) {
        this.tourRepository = tourRepository;
    }
    async find(options) {
        let result = [];
        let totalRecords = 0;
        const { searchText, pageNumber, pageSize } = options;
        if (pageNumber && pageSize) {
            const [data, total] = await this.tourRepository
                .createQueryBuilder()
                .orderBy('tour_slug', 'ASC')
                .skip((pageNumber - 1) * pageSize)
                .take(pageSize)
                .getManyAndCount();
            result = [...data];
            totalRecords = total;
        }
        else {
            result = (await this.tourRepository.find());
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
        return this.tourRepository.findOneBy({ tour_slug: slug });
    }
};
exports.ToursService = ToursService;
exports.ToursService = ToursService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tours_model_1.TourModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ToursService);
//# sourceMappingURL=tours.service.js.map