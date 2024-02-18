import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingModel, TBooking } from './bookings.model';
import { Repository } from 'typeorm';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(BookingModel)
        private bookingRepository: Repository<BookingModel>,
      ) {}
    
    findOne(id: string): Promise<BookingModel | null> {
        return this.bookingRepository.findOneBy({ id });
    }

    create(bookingInfo: TBooking): Promise<BookingModel> {
        const info = {...bookingInfo, packages: ''};
        info.packages = bookingInfo.packages.join(',');
        return this.bookingRepository.save(info);
    }

    update(bookingInfo: Partial<TBooking> & { id: string }): Promise<BookingModel> {
        const info = {...bookingInfo, packages: ''};
        info.packages = bookingInfo.packages.join(',');
        return this.bookingRepository.save(info);
    }
}
