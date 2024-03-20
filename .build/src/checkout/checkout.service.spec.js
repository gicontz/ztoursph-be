"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const checkout_service_1 = require("./checkout.service");
describe('CheckoutService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [checkout_service_1.CheckoutService],
        }).compile();
        service = module.get(checkout_service_1.CheckoutService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=checkout.service.spec.js.map