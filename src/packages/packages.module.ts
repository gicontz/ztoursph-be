import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesService } from './packages.service';
import { S3Service } from 'src/aws-sdk/s3.object';
import { PackagesController } from './packages.controller';
import { PackageModel } from './packages.model';
import { CacheModule } from '@nestjs/cache-manager';
import { S3BucketService } from 'src/middlewares/s3.service';

@Module({
    imports: [CacheModule.register(), TypeOrmModule.forFeature([PackageModel])],
    providers: [PackagesService, S3Service, S3BucketService],
    exports: [PackagesService],
    controllers: [PackagesController]
})

export class PackagesModule {}
