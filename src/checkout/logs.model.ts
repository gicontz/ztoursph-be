import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type TPaymentLog = {
    referenceId?: string;
    logs: string;
}

@Entity({ name: 'payment_webhook_logs' })
export class PaymentLogsModel {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @Column({ type: 'text', nullable: true })
    referenceId: string;
    @Column({ type: 'text', nullable: true })
    logs: string;
    @Column({ type: 'date', nullable: false, default: new Date() })
    date: Date;
}