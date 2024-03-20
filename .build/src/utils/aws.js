"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUri = exports.AppBucketNames = void 0;
const s3_object_1 = require("src/third-party/aws-sdk/s3.object");
var AppBucketNames;
(function (AppBucketNames) {
    AppBucketNames["USERS"] = "ztoursph-user-images";
    AppBucketNames["HOME_PAGE"] = "ztoursph-homepage-images";
    AppBucketNames["TOURS"] = "ztoursph-tour-images";
})(AppBucketNames || (exports.AppBucketNames = AppBucketNames = {}));
const getFileUri = async (Key, Bucket) => {
    const imageUri = await (new s3_object_1.S3Service).getFileURI(Key, Bucket);
    return imageUri;
};
exports.getFileUri = getFileUri;
//# sourceMappingURL=aws.js.map