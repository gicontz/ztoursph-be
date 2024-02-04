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
        
        result = (await this.tourRepository.find()) as TourModel[];

        if (searchText) {
          const filteredResult = result.filter((user) => {
            return JSON.stringify(user).toLowerCase().includes(searchText.toLowerCase());
          });
          return filteredResult;
        }
        return result;
    }
    
    findOne(slug: string): Promise<TourModel | null> {
        return this.tourRepository.findOneBy({ tour_slug: slug });
      }
}
