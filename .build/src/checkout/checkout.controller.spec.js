"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const checkout_controller_1 = require("./checkout.controller");
describe('CheckoutController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [checkout_controller_1.CheckoutController],
        }).compile();
        controller = module.get(checkout_controller_1.CheckoutController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=checkout.controller.spec.js.map