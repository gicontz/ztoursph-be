import { TUser, UserModel } from './users.model';
import { Repository } from 'typeorm';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<UserModel>);
    findOne(data: {
        id?: string;
        email?: string;
    }): Promise<Required<TUser> | null>;
    create(userInfo: Omit<TUser, 'signup_date'>): Promise<Required<TUser> | null>;
}
