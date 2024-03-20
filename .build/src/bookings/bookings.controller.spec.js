"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const bookings_controller_1 = require("./bookings.controller");
describe('BookingsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [bookings_controller_1.BookingsController],
        }).compile();
        controller = module.get(bookings_controller_1.BookingsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=bookings.controller.spec.js.map