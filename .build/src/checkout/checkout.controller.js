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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("src/users/users.service");
const checkout_model_1 = require("./checkout.model");
const bookings_service_1 = require("src/bookings/bookings.service");
const bookings_model_1 = require("src/bookings/bookings.model");
const maya_service_1 = require("src/third-party/maya-sdk/maya.service");
const checkout_service_1 = require("./checkout.service");
const checkout_dto_1 = require("./checkout.dto");
const maya_dto_1 = require("src/third-party/maya-sdk/maya.dto");
let CheckoutController = class CheckoutController {
    constructor(userService, mayaService, bookingService, checkoutService) {
        this.userService = userService;
        this.mayaService = mayaService;
        this.bookingService = bookingService;
        this.checkoutService = checkoutService;
    }
    async checkoutTrips(data) {
        let userInfo = await this.userService.findOne({ id: data.userId, email: data.userEmail });
        if (!userInfo) {
            const newUserData = {
                email: data.userEmail,
                first_name: data.first_name,
                middle_init: data.middle_init,
                last_name: data.last_name
            };
            userInfo = await this.userService.create(newUserData);
        }
        const { packages, totalAmt } = data;
        const newBooking = await this.bookingService.create({
            packages,
            total_amt: totalAmt,
            user_id: userInfo.id,
            paymentStatus: bookings_model_1.PaymentStatus.UNPAID,
        });
        return {
            status: common_1.HttpStatus.ACCEPTED,
            message: 'Trips Checkout Successfully!',
            data: newBooking
        };
    }
    async checkoutPayment(paymentData) {
        try {
            const bookingInfo = await this.bookingService.findOne(paymentData.bookingId);
            const userId = bookingInfo.user_id;
            paymentData.userId = userId;
            if (bookingInfo.paymentStatus === bookings_model_1.PaymentStatus.PAID) {
                return {
                    status: common_1.HttpStatus.OK,
                    message: 'You already paid for this booking. Thank you!'
                };
            }
        }
        catch (e) {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Booking Info not found'
            };
        }
        try {
            const paymentInfo = await this.checkoutService.create(paymentData);
            const referenceId = paymentInfo.referenceId;
            if (paymentData) {
                const data = await this.mayaService.checkout({
                    totalAmount: {
                        value: paymentData.amount,
                        currency: 'PHP',
                    },
                    requestReferenceNumber: referenceId,
                });
                return data;
            }
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Payment Data is required'
            };
        }
        catch (e) {
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: `Error in processing payment: CODE - ${e.code}`
            };
        }
    }
    async verifyPayment(paymentResponse) {
        const status = this.mayaService.verifyPayment(paymentResponse);
        let bookingId = '';
        try {
            bookingId = (await this.checkoutService.findOne(paymentResponse.requestReferenceNumber)).bookingId;
        }
        catch (e) {
            console.warn(new Date(), e);
            return {
                status: common_1.HttpStatus.OK,
                message: 'Booking Info not found. Check your reference number.'
            };
        }
        switch (status) {
            case maya_dto_1.TPaymentStatus.SUCCESS: {
                try {
                    const paymentInfo = await this.checkoutService.update({
                        referenceId: paymentResponse.requestReferenceNumber,
                        status: checkout_model_1.TCheckoutPaymentStatus.SUCCESS,
                        updatedAt: new Date(),
                        receiptNumber: paymentResponse.receiptNumber,
                        paymentType: paymentResponse.fundSource.type === 'card' ? checkout_model_1.TPaymentType.CREDIT_CARD : checkout_model_1.TPaymentType.E_WALLET,
                        success_response: JSON.stringify(paymentResponse)
                    });
                    await this.bookingService.update({ id: bookingId, paymentStatus: bookings_model_1.PaymentStatus.PAID, approval_code: paymentResponse.approvalCode });
                    delete paymentInfo.success_response;
                    return {
                        status: common_1.HttpStatus.OK,
                        message: 'Payment has been verified',
                        data: paymentInfo
                    };
                }
                catch (e) {
                    console.warn(new Date(), e);
                    return {
                        status: common_1.HttpStatus.OK,
                        message: 'Payment stuck while verifying. Please contact support.',
                        data: {
                            status: paymentResponse.status,
                            receiptNumber: paymentResponse.receiptNumber,
                            errorMessage: e.detail,
                        }
                    };
                }
            }
            case maya_dto_1.TPaymentStatus.AUTHORIZED: {
                try {
                    const paymentInfo = await this.checkoutService.update({
                        referenceId: paymentResponse.requestReferenceNumber,
                        status: checkout_model_1.TCheckoutPaymentStatus.PENDING,
                        updatedAt: new Date(),
                        receiptNumber: paymentResponse.receiptNumber,
                        success_response: JSON.stringify(paymentResponse)
                    });
                    delete paymentInfo.success_response;
                    return {
                        status: common_1.HttpStatus.OK,
                        message: 'Payment process is still pending. Please wait for the payment to be verified.',
                        data: paymentInfo
                    };
                }
                catch (e) {
                    console.warn(new Date(), e);
                    return {
                        status: common_1.HttpStatus.OK,
                        message: 'Payment stuck while verifying. Please contact support.',
                        data: {
                            status: paymentResponse.status,
                            receiptNumber: paymentResponse.receiptNumber,
                        }
                    };
                }
            }
            default: {
                try {
                    const paymentInfo = await this.checkoutService.update({
                        referenceId: paymentResponse.requestReferenceNumber,
                        status: checkout_model_1.TCheckoutPaymentStatus.FAILED,
                        updatedAt: new Date(),
                        receiptNumber: paymentResponse.errorCode,
                        paymentType: paymentResponse.fundSource.type === 'card' ? checkout_model_1.TPaymentType.CREDIT_CARD : checkout_model_1.TPaymentType.E_WALLET,
                        failed_response: JSON.stringify(paymentResponse)
                    });
                    delete paymentInfo.failed_response;
                    return {
                        status: common_1.HttpStatus.OK,
                        message: 'Payment failed, cancelled or cannot be verified.',
                        data: paymentInfo
                    };
                }
                catch (e) {
                    console.warn(new Date(), e);
                    return {
                        status: common_1.HttpStatus.OK,
                        message: 'Payment has not been verified'
                    };
                }
            }
        }
    }
};
exports.CheckoutController = CheckoutController;
__decorate([
    (0, common_1.Post)('/trips'),
    (0, swagger_1.ApiBody)({ required: true }),
    __param(0, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "checkoutTrips", null);
__decorate([
    (0, common_1.Post)('/payment'),
    (0, swagger_1.ApiBody)({ required: true, description: "This is an example of the payment data", type: checkout_dto_1.TPaymentDTO, examples: {
            example1: {
                summary: 'Payment Data Example',
                value: checkout_dto_1.PAYMENT_DTO_EXAMPLE,
            }
        } }),
    __param(0, (0, common_1.Body)('paymentData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "checkoutPayment", null);
__decorate([
    (0, common_1.Post)('/verify'),
    (0, swagger_1.ApiBody)({ required: true, description: "A webhook for payment process of maya, consumes PAYMENT_SUCCESS, PAYMENT_FAILED, PAYMENT_EXPIRED, PAYMENT_CANCELLED, and AUTHORIZED" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "verifyPayment", null);
exports.CheckoutController = CheckoutController = __decorate([
    (0, swagger_1.ApiTags)('Checkout'),
    (0, common_1.Controller)('checkout'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        maya_service_1.MayaService,
        bookings_service_1.BookingsService,
        checkout_service_1.CheckoutService])
], CheckoutController);
//# sourceMappingURL=checkout.controller.js.map