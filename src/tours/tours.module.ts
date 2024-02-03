import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursService } from './tours.service';
import { S3Service } from 'src/aws-sdk/s3.object';
import { ToursController } from './tours.controller';
import { TourModel } from './tours.model';

@Module({
    imports: [TypeOrmModule.forFeature([TourModel])],
    providers: [ToursService, S3Service],
    exports: [ToursService],
    controllers: [ToursController]
})

export class ToursModule {}
