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

  async find(options?: {
    searchText?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<{ records: TourModel[]; totalRecords: number }> {
    let result = [];
    let totalRecords = 0;
    const { searchText, pageNumber, pageSize } = options;

    if (pageNumber && pageSize) {
      const [data, total] = await this.tourRepository
        .createQueryBuilder()
        .orderBy('tour_slug', 'ASC')
        .skip((pageNumber - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
      result = [...data];
      totalRecords = total;
    } else {
      result = (await this.tourRepository.find()) as TourModel[];
    }

    if (searchText) {
      const filteredResult = result.filter((user) => {
        return JSON.stringify(user)
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
      return {
        records: [...filteredResult],
        totalRecords,
      };
    }
    return {
      records: [...result],
      totalRecords,
    };
  }

  findOne(slug: string): Promise<TourModel | null> {
    return this.tourRepository.findOneBy({ tour_slug: slug });
  }

  findByIds(ids: number[]): Promise<TourModel[]> {
    return this.tourRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getMany();
  }
}
