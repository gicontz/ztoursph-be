"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutModel = exports.TPaymentType = exports.TCheckoutPaymentStatus = void 0;
const typeorm_1 = require("typeorm");
var TCheckoutPaymentStatus;
(function (TCheckoutPaymentStatus) {
    TCheckoutPaymentStatus["PENDING"] = "PENDING";
    TCheckoutPaymentStatus["FAILED"] = "FAILED";
    TCheckoutPaymentStatus["SUCCESS"] = "SUCCESS";
})(TCheckoutPaymentStatus || (exports.TCheckoutPaymentStatus = TCheckoutPaymentStatus = {}));
var TPaymentType;
(function (TPaymentType) {
    TPaymentType["CREDIT_CARD"] = "CREDIT CARD";
    TPaymentType["E_WALLET"] = "E-WALLET";
})(TPaymentType || (exports.TPaymentType = TPaymentType = {}));
;
let CheckoutModel = class CheckoutModel {
};
exports.CheckoutModel = CheckoutModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CheckoutModel.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], CheckoutModel.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], CheckoutModel.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], CheckoutModel.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TCheckoutPaymentStatus, default: TCheckoutPaymentStatus.PENDING, nullable: false }),
    __metadata("design:type", String)
], CheckoutModel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TPaymentType, nullable: true, unique: true }),
    __metadata("design:type", String)
], CheckoutModel.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], CheckoutModel.prototype, "receiptNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CheckoutModel.prototype, "success_response", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CheckoutModel.prototype, "failed_response", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: false, default: new Date() }),
    __metadata("design:type", Date)
], CheckoutModel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: false, default: new Date() }),
    __metadata("design:type", Date)
], CheckoutModel.prototype, "updatedAt", void 0);
exports.CheckoutModel = CheckoutModel = __decorate([
    (0, typeorm_1.Entity)({ name: 'payments' })
], CheckoutModel);
//# sourceMappingURL=checkout.model.js.map