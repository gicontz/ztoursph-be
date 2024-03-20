"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    },
    cache: {
        ttl: parseInt(process.env.CACHE_TTL, 10) || 120,
        aws_ttl: parseInt(process.env.AWS_S3_TTL, 10) || 1000
    },
    maya: {
        faceApi: process.env.MAYA_PUBLIC_FACE_API,
        secretKey: process.env.MAYA_SECRET_API,
        checkoutApi: process.env.MAYA_CHECKOUT_API,
    }
});
//# sourceMappingURL=config.js.map