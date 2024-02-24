import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from './users.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([UserModel])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
