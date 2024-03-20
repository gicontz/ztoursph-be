"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const pdf_service_1 = require("./pdf.service");
describe('PdfService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [pdf_service_1.PdfService],
        }).compile();
        service = module.get(pdf_service_1.PdfService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=pdf.service.spec.js.map