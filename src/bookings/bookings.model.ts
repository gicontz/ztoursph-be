import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  PENDING = 'PENDING',
}

export type TParticipant = {
  name: string;
  age: number;
  nationality: string;
};

export type TPackage = {
  id: string | number;
  pax: number;
  date: string;
  participants: TParticipant[];
  category?: 'tours' | 'packages';
};

export type TBooking = {
  id?: string;
  user_id: string;
  packages?: TPackage[];
  total_amt: number;
  paymentStatus: PaymentStatus;
  reference_id: string;
  approval_code?: string;
  receipt?: string;
  itinerary?: string;
};

@Entity({ name: 'bookings' })
export class BookingModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', nullable: false })
  user_id: string;
  @Column({ type: 'text', nullable: false })
  packages: string;
  @Column({ type: 'float', nullable: false })
  total_amt: number;
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
    nullable: false,
  })
  paymentStatus: PaymentStatus;
  @Column({ type: 'text', nullable: false, unique: true })
  approval_code: string;
  @Column({ type: 'text', nullable: false })
  receipt: string;
  @Column({ type: 'text', nullable: false })
  itinerary: string;
  @Column({ type: 'date', nullable: false, default: new Date() })
  created_date: string;
  @Column({ type: 'date', nullable: false, default: new Date() })
  updated_date: string;
  @Column({ type: 'text', nullable: false })
  reference_id: string;
}
