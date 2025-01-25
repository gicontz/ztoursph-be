import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingModel, TBooking } from './bookings.model';
import { Repository } from 'typeorm';
import config from 'src/config/config';
import { TCalculation, TPreCheckout } from 'src/checkout/checkout.dto';
import { ToursService } from 'src/tours/tours.service';
import { PackagesService } from 'src/packages/packages.service';

@Injectable()
export class BookingsService {
  private cnfg = config();
  constructor(
    private readonly toursService: ToursService,
    private readonly packageService: PackagesService,
    @InjectRepository(BookingModel)
    private bookingRepository: Repository<BookingModel>,
  ) {}

  findOne(id: string): Promise<BookingModel | null> {
    return this.bookingRepository.findOneBy({ id });
  }

  findByRef(data: {
    user_id?: string;
    reference_id: string;
  }): Promise<BookingModel | null> {
    return this.bookingRepository.findOneBy({
      user_id: data.user_id,
      reference_id: data.reference_id,
    });
  }

  findAll(userId: string): Promise<BookingModel[]> {
    return this.bookingRepository.find({ where: { user_id: userId } });
  }

  create(bookingInfo: TBooking): Promise<BookingModel> {
    const info = { ...bookingInfo, packages: '' };
    info.packages = JSON.stringify(bookingInfo.packages);
    return this.bookingRepository.save(info);
  }

  async update(bookingInfo: Partial<TBooking>): Promise<BookingModel> {
    await this.bookingRepository.save(bookingInfo as any);
    return this.bookingRepository.findOneBy({ id: bookingInfo.id });
  }

  async calculateTotalAmts(data: TPreCheckout): Promise<TCalculation> {
    const { booking } = data;

    const trips: Array<{
      id: string | number;
      price: number;
      per_pax_price: number;
      min_pax: number;
      discount: number;
      pax: number;
      ages: number[];
    }> = [];

    for (const b of booking) {
      const tour = await this.toursService.findById(b.id as number);
      const pkg = await this.packageService.findById(b.id as string);
      if (tour) trips.push({ ...tour, pax: b.pax, ages: b.ages });
      if (pkg) trips.push({ ...pkg, pax: b.pax, ages: b.ages });
    }

    const getSubTotal = (prices: {
      price: number;
      pax: number;
      discount: number;
      min_pax: number;
      per_pax_price: number;
      ages: number[];
    }) => {
      const { price, pax, discount, min_pax, per_pax_price, ages } = prices;
      const discountedPrice = price - price * (discount / 100);
      const floatPax = ages.reduce((acc, curr) => {
        if (curr <= 3)
          return acc - (1 - this.cnfg.payments.discounts.kidsUnderFour / 100);
        if (curr < 7)
          return acc - (1 - this.cnfg.payments.discounts.kidsUnderSeven / 100);
        return acc;
      }, pax);
      if (min_pax > 1) {
        const additionalPax = floatPax - min_pax;
        return discountedPrice + additionalPax * per_pax_price;
      }
      return Math.ceil(discountedPrice * floatPax);
    };

    const subTotals = trips.map((t) => {
      const { id, price, min_pax, per_pax_price, discount, ages, pax } = t;
      return {
        id,
        pax,
        subTotal: getSubTotal({
          price,
          pax,
          discount,
          min_pax,
          per_pax_price,
          ages,
        }),
      };
    });

    const totalAmt = subTotals.reduce((acc, curr) => acc + curr.subTotal, 0);

    const processingFee = Math.ceil(
      totalAmt * (this.cnfg.payments.processingFeeRates / 100) +
        this.cnfg.payments.processingFee,
    );

    console.log('processingFee', processingFee);

    const totalAmtTbp = totalAmt + processingFee;

    return {
      subTotals,
      totalAmt,
      processingFee,
      totalAmtTbp,
    };
  }
}
