"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MayaService = void 0;
const config_1 = require("@config/config");
const axios_1 = require("axios");
class MayaService {
    constructor() {
        this.cnfg = (0, config_1.default)();
        this.FACE_API_KEY = '';
        this.SECRET_KEY = '';
        this.CHECKOUT_API = '';
        this.FACE_API_KEY = this.cnfg.maya.faceApi;
        this.SECRET_KEY = this.cnfg.maya.secretKey;
        this.CHECKOUT_API = this.cnfg.maya.checkoutApi;
    }
    async checkout(data) {
        const headers = {
            authorization: `Basic ${Buffer.from(this.FACE_API_KEY).toString('base64')}`,
        };
        try {
            const checkoutRequest = await axios_1.default.post(this.CHECKOUT_API, data, { headers });
            return {
                status: checkoutRequest.status,
                message: checkoutRequest.statusText,
                data: checkoutRequest.data
            };
        }
        catch (e) {
            return {
                message: e,
                status: e.response.status,
            };
        }
    }
    verifyPayment(res) {
        return res.status;
    }
}
exports.MayaService = MayaService;
//# sourceMappingURL=maya.service.js.map