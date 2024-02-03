import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { TResponseData } from 'src/http.types';
import { ToursService } from './tours.service';
import { S3Service } from 'src/aws-sdk/s3.object';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
    constructor(private readonly toursService: ToursService, private readonly s3Service: S3Service) {}

    @Get('/')
    async getTours(): Promise<TResponseData> {
        const tours = await this.toursService.find();
        return {
            status: HttpStatus.OK,
            message: 'User Retrieved Successfully.',
            data: {
                ...tours,
            },
        };
    };
}
