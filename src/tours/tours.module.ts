import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursService } from './tours.service';
import { S3Service } from 'src/third-party/aws-sdk/s3.object';
import { ToursController } from './tours.controller';
import { TourModel } from './tours.model';
import { CacheModule } from '@nestjs/cache-manager';
import { S3BucketService } from 'src/middlewares/s3.service';

@Module({
    imports: [CacheModule.register(), TypeOrmModule.forFeature([TourModel])],
    providers: [ToursService, S3Service, S3BucketService],
    exports: [ToursService],
    controllers: [ToursController]
})

export class ToursModule {}
