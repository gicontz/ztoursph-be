import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    PENDING = "PENDING"
};

export type TBooking = {
    id?: string;
    user_id: string;
    packages?: string[];
    total_amt: number;
    paymentStatus: PaymentStatus;
    approval_code?: string;
    receipt?: string;
    itinerary?: string;
}

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
    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID, nullable: false })
    paymentStatus: PaymentStatus;
    @Column({ type: 'text', nullable: false, unique: true })
    approval_code: string;
    @Column({ type: 'text', nullable: false })
    receipt: string;
    @Column({ type: 'text', nullable: false })
    itinerary: string;
    @Column({ type: 'date', nullable: true })
    created_date: string;
    @Column({ type: 'date', nullable: true })
    updated_date: string;
};


export type TBookedTour = {
    id?: string;//uuid
    tour_id: string;
    booking_id: string;
    start_date: Date;
    end_date?: Date;
    pax: number;
    pickup_location: string;
    amount_per_pax: number;
    description: string;
};

@Entity({ name: 'booked_tours' })
export class BookedTourModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'text', nullable: false })
    tour_id: string;
    @Column({ type: 'text', nullable: false })
    booking_id: string;
    @Column({ type: 'date', nullable: false })
    start_date: Date;
    @Column({ type: 'date', nullable: true })
    end_date: Date;
    @Column({ type: 'int', nullable: false })
    pax: number;
    @Column({ type: 'text', nullable: false })
    pickup_location: string;
    @Column({ type: 'float', nullable: false })
    amount_per_pax: number;
    @Column({ type: 'text', nullable: false })
    description: string;
    @Column({ type: 'date', nullable: true })
    created_date: string;
    @Column({ type: 'date', nullable: true })
    updated_date: string;
};