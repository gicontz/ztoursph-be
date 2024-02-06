import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursModule } from './tours/tours.module';
import { CacheModule } from '@nestjs/cache-manager';

// console.log(process.env);
@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.model.js'],
      migrationsRun: false,
      ssl: true,
      migrations: [
        "src/database/migrations/*.ts"
      ],
      synchronize: false,
    }),
    ToursModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }