import { S3Service } from 'src/third-party/aws-sdk/s3.object';
export declare class S3BucketService {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    private BUCKET_NAME;
    getImage(Key: any): Promise<string>;
    getPDF(Key: any): Promise<string>;
}
