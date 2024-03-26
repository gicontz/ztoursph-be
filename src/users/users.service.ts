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
    const value = data.id ? data.id : data.email;
    const key = data.id ? 'id' : 'email';
    return this.userRepository.findOneBy({ [key]: value });
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
