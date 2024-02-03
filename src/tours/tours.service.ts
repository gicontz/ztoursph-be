import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TourModel } from './tours.model';
import { Repository } from 'typeorm';

@Injectable()
export class ToursService {
    constructor(
        @InjectRepository(TourModel)
        private tourRepository: Repository<TourModel>,
      ) {}
    
    async find(searchText?: string): Promise<TourModel[]> {
        let result = [];
        
        result = await this.tourRepository.find();

        if (searchText) {
          const filteredResult = result.filter((user) => {
            return JSON.stringify(user).toLowerCase().includes(searchText.toLowerCase());
          });
          return filteredResult;
        }
        return result;
      }
}
