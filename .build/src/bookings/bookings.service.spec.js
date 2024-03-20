"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const bookings_service_1 = require("./bookings.service");
describe('BookingsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [bookings_service_1.BookingsService],
        }).compile();
        service = module.get(bookings_service_1.BookingsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=bookings.service.spec.js.map