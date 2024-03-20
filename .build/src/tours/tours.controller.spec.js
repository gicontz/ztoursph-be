"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tours_controller_1 = require("./tours.controller");
describe('ToursController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [tours_controller_1.ToursController],
        }).compile();
        controller = module.get(tours_controller_1.ToursController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=tours.controller.spec.js.map