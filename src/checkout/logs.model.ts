import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type TPaymentLog = {
    reference_id?: string;
    logs: string;
}

@Entity({ name: 'payment_webhook_logs' })
export class PaymentLogsModel {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @Column({ type: 'text', nullable: true })
    reference_id: string;
    @Column({ type: 'text', nullable: true })
    logs: string;
    @Column({ type: 'date', nullable: false, default: new Date() })
    date: Date;
}