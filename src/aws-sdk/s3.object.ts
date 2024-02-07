/*********************************************************
 * AWS S3 Object Class Typescript File - Revision History
 *********************************************************
 *     Date    *       Author    * Description of Changes
 *********************************************************
 * 12/09/2022  * Gim Contillo    * Initial Change
*********************************************************/
import * as AWS from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '@config/config';

export type TFile = {
    bucketname: string;
    fieldname: string;
    buffer: Buffer;
    filename: string;
    mimetype: string;
}

export class S3Service {
    private s3 = new AWS.S3Client({
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
        },
        region: process.env.AWS_REGION
    });

    private cnfg =  config();

    public async uploadFiles(files: any[]): Promise<AWS.AbortMultipartUploadCommandOutput[] | AWS.CompleteMultipartUploadCommandOutput[]> {
        const promises = files.map(async (file: TFile) => {
          const params = {
            Bucket: file.bucketname,
            Key: file.filename,
            Body: file.buffer,
            ContentType: file.mimetype,
          };
    
          return new Upload({
            client: this.s3,
            params,
          }).done();
        });
    
        return Promise.all(promises);
    }

    public async getFileURI(Key: string, Bucket: string): Promise<string>{
        const data = await getSignedUrl(this.s3, new GetObjectCommand({
            Bucket,
            Key,
        }), { expiresIn: this.cnfg.cache.aws_ttl });

        return data;
    }
}