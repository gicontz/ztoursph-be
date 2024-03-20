"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const tours_module_1 = require("./tours/tours.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const packages_module_1 = require("./packages/packages.module");
const checkout_module_1 = require("./checkout/checkout.module");
const bookings_module_1 = require("./bookings/bookings.module");
const users_module_1 = require("./users/users.module");
const pdf_module_1 = require("./pdf/pdf.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.register(),
            config_1.ConfigModule.forRoot({ cache: true, isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: 5432,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: ['dist/**/*.model.js'],
                migrationsRun: false,
                ssl: true,
                migrations: [
                    "src/database/migrations/*.ts"
                ],
                synchronize: false,
            }),
            tours_module_1.ToursModule,
            packages_module_1.PackagesModule,
            checkout_module_1.CheckoutModule,
            bookings_module_1.BookingsModule,
            users_module_1.UsersModule,
            pdf_module_1.PdfModule,
        ],
        controllers: [],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map