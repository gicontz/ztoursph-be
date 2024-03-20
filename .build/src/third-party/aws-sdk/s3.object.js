"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const AWS = require("@aws-sdk/client-s3");
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = require("@config/config");
class S3Service {
    constructor() {
        this.s3 = new AWS.S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
            },
            region: process.env.AWS_REGION
        });
        this.cnfg = (0, config_1.default)();
    }
    async uploadFiles(files) {
        const promises = files.map(async (file) => {
            const params = {
                Bucket: file.bucketname,
                Key: file.filename,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            return new lib_storage_1.Upload({
                client: this.s3,
                params,
            }).done();
        });
        return Promise.all(promises);
    }
    async getFileURI(Key, Bucket) {
        const data = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({
            Bucket,
            Key,
        }), { expiresIn: this.cnfg.cache.aws_ttl });
        return data;
    }
}
exports.S3Service = S3Service;
//# sourceMappingURL=s3.object.js.map