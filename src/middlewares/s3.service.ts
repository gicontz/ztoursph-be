import { Injectable, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { S3Service } from 'src/aws-sdk/s3.object';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class S3BucketService {
    constructor(private readonly s3Service: S3Service) {}
    private BUCKET_NAME = process.env.AWS_S3_BUCKET;
    
    @CacheTTL(600)
    async getImage(Key) {
      const image = await this.s3Service.getFileURI(Key, this.BUCKET_NAME);
      return image;
    }
}
