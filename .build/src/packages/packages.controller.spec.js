"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const packages_controller_1 = require("./packages.controller");
describe('PackagesController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [packages_controller_1.PackagesController],
        }).compile();
        controller = module.get(packages_controller_1.PackagesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=packages.controller.spec.js.map