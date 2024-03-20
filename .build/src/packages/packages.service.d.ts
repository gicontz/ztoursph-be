import { PackageModel } from './packages.model';
import { Repository } from 'typeorm';
export declare class PackagesService {
    private packageRepository;
    constructor(packageRepository: Repository<PackageModel>);
    find(options?: {
        searchText?: string;
        pageNumber?: number;
        pageSize?: number;
    }): Promise<{
        records: PackageModel[];
        totalRecords: number;
    }>;
    findOne(slug: string): Promise<PackageModel | null>;
}
