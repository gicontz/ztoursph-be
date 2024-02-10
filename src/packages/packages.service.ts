import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageModel } from './packages.model';
import { Repository } from 'typeorm';

@Injectable()
export class PackagesService {
    constructor(
        @InjectRepository(PackageModel)
        private packageRepository: Repository<PackageModel>,
      ) {}
    
    async find(options?: { searchText?: string, pageNumber?: number, pageSize?: number }): Promise<{ records: PackageModel[], totalRecords: number }> {
        let result = [];
        let totalRecords = 0;
        const { searchText, pageNumber, pageSize } = options;
        
        if (pageNumber && pageSize) {
          const [data, total ] = await this.packageRepository
            .createQueryBuilder()
            .orderBy('package_slug', 'ASC')
            .skip((pageNumber - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
          result = [...data];
          totalRecords = total;
        } else {
          result = (await this.packageRepository.find()) as PackageModel[];
        }

        if (searchText) {
          const filteredResult = result.filter((user) => {
            return JSON.stringify(user).toLowerCase().includes(searchText.toLowerCase());
          });
          return {
            records: [...filteredResult],
            totalRecords
          };
        }
        return {
          records: [...result],
          totalRecords
        };;
    }
    
    findOne(slug: string): Promise<PackageModel | null> {
        return this.packageRepository.findOneBy({ package_slug: slug });
      }
}
