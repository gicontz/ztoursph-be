/// <reference types="node" />
import * as AWS from '@aws-sdk/client-s3';
export type TFile = {
    bucketname: string;
    fieldname: string;
    buffer: Buffer;
    filename: string;
    mimetype: string;
};
export declare class S3Service {
    private s3;
    private cnfg;
    uploadFiles(files: any[]): Promise<AWS.AbortMultipartUploadCommandOutput[] | AWS.CompleteMultipartUploadCommandOutput[]>;
    getFileURI(Key: string, Bucket: string): Promise<string>;
}
