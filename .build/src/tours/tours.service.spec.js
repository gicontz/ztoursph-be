"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tours_service_1 = require("./tours.service");
describe('ToursService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [tours_service_1.ToursService],
        }).compile();
        service = module.get(tours_service_1.ToursService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=tours.service.spec.js.map