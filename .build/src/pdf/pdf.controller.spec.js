"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const pdf_controller_1 = require("./pdf.controller");
describe('PdfController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [pdf_controller_1.PdfController],
        }).compile();
        controller = module.get(pdf_controller_1.PdfController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=pdf.controller.spec.js.map