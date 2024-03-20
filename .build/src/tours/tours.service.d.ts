import { TourModel } from './tours.model';
import { Repository } from 'typeorm';
export declare class ToursService {
    private tourRepository;
    constructor(tourRepository: Repository<TourModel>);
    find(options?: {
        searchText?: string;
        pageNumber?: number;
        pageSize?: number;
    }): Promise<{
        records: TourModel[];
        totalRecords: number;
    }>;
    findOne(slug: string): Promise<TourModel | null>;
}
