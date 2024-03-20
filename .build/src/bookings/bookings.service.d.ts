import { BookingModel, TBooking } from './bookings.model';
import { Repository } from 'typeorm';
export declare class BookingsService {
    private bookingRepository;
    constructor(bookingRepository: Repository<BookingModel>);
    findOne(id: string): Promise<BookingModel | null>;
    create(bookingInfo: TBooking): Promise<BookingModel>;
    update(bookingInfo: Partial<TBooking>): Promise<BookingModel>;
}
