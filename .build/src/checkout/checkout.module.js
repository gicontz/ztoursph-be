"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutModule = void 0;
const common_1 = require("@nestjs/common");
const checkout_service_1 = require("./checkout.service");
const checkout_controller_1 = require("./checkout.controller");
const typeorm_1 = require("@nestjs/typeorm");
const users_service_1 = require("src/users/users.service");
const users_model_1 = require("src/users/users.model");
const cache_manager_1 = require("@nestjs/cache-manager");
const bookings_service_1 = require("src/bookings/bookings.service");
const bookings_model_1 = require("src/bookings/bookings.model");
const maya_service_1 = require("src/third-party/maya-sdk/maya.service");
const checkout_model_1 = require("./checkout.model");
let CheckoutModule = class CheckoutModule {
};
exports.CheckoutModule = CheckoutModule;
exports.CheckoutModule = CheckoutModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.register(),
            typeorm_1.TypeOrmModule.forFeature([users_model_1.UserModel]),
            typeorm_1.TypeOrmModule.forFeature([bookings_model_1.BookingModel]),
            typeorm_1.TypeOrmModule.forFeature([checkout_model_1.CheckoutModel])
        ],
        providers: [checkout_service_1.CheckoutService, maya_service_1.MayaService, users_service_1.UsersService, bookings_service_1.BookingsService],
        exports: [checkout_service_1.CheckoutService, users_service_1.UsersService, bookings_service_1.BookingsService],
        controllers: [checkout_controller_1.CheckoutController]
    })
], CheckoutModule);
//# sourceMappingURL=checkout.module.js.map