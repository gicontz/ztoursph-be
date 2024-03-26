import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursModule } from './tours/tours.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PackagesModule } from './packages/packages.module';
import { CheckoutModule } from './checkout/checkout.module';
import { BookingsModule } from './bookings/bookings.module';
import { UsersModule } from './users/users.module';
import { PdfModule } from './pdf/pdf.module';

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
      migrations: ['src/database/migrations/*.ts'],
      synchronize: false,
    }),
    ToursModule,
    PackagesModule,
    CheckoutModule,
    BookingsModule,
    UsersModule,
    PdfModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
