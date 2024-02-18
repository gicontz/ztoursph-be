import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    PENDING = "PENDING"
};

export type TBooking = {
    id?: string;
    user_id: string;
    packages: string[];
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
}