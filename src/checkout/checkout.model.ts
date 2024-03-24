import { UserSex } from "src/users/users.model";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type TCheckout = {
    userId?: string;
    userEmail: string;
    first_name: string;
    last_name: string;
    mobile_number1: string;
    mobile_number2: string;
    birthday: Date;
    sex: UserSex;
    middle_init: string;
    packages: string;
    totalAmt: number;
};

export type TPaymentFees = {
    totalAmt: number;
    processingFee: number;
    description: string;
}

export enum TCheckoutPaymentStatus {
    PENDING = 'PENDING',
    FAILED = 'FAILED',
    SUCCESS = 'SUCCESS'
}

export enum TPaymentType {
    CREDIT_CARD = 'CREDIT CARD',
    E_WALLET = 'E-WALLET',
};

export type TPayment = {
    referenceId?: string;
    userId?: string;
    bookingId: string;
    amount: number;
    status: TCheckoutPaymentStatus;
    paymentType: TPaymentType;
    receiptNumber: string | null;
    success_response: string;
    failed_response: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
};

@Entity({ name: 'payments' })
export class CheckoutModel {
    @PrimaryGeneratedColumn('uuid')
    referenceId: string;
    @Column({ type: 'text', nullable: false })
    userId: string;
    @Column({ type: 'text', nullable: false })
    bookingId: string;
    @Column({ type: 'float', nullable: false })
    amount: number;
    @Column({ type: 'enum', enum: TCheckoutPaymentStatus, default: TCheckoutPaymentStatus.PENDING, nullable: false })
    status: TCheckoutPaymentStatus;
    @Column({ type: 'enum', enum: TPaymentType, nullable: true, unique: true })
    paymentType: TPaymentType;
    @Column({ type: 'text', nullable: false })
    receiptNumber: string;
    @Column({ type: 'text', nullable: true })
    success_response: string;
    @Column({ type: 'text', nullable: true })
    failed_response: string;
    @Column({ type: 'date', nullable: false, default: new Date() })
    createdAt: Date;
    @Column({ type: 'date', nullable: false, default: new Date() })
    updatedAt: Date;
}