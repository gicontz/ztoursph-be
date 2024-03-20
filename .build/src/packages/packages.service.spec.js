"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const packages_service_1 = require("./packages.service");
describe('PackagesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [packages_service_1.PackagesService],
        }).compile();
        service = module.get(packages_service_1.PackagesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=packages.service.spec.js.map