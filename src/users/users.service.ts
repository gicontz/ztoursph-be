import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TUser, UserModel } from './users.model';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
  ) {}

  async findOne(data: {
    id?: string;
    email?: string;
  }): Promise<Required<TUser> | null> {
    const query = {
      id: data.id,
      email: data.email,
    };
    if (!query.id) delete query.id;
    if (!query.email) delete query.email;
    const dd = await this.userRepository.findOneBy({
      id: data.id,
      email: data.email,
    });
    return dd;
  }

  async create(
    userInfo: Omit<TUser, 'signup_date'>,
  ): Promise<Required<TUser> | null> {
    const data = {
      ...userInfo,
      signup_date: new Date(),
    };
    return this.userRepository.save(data);
  }
}
