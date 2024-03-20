export declare enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    PENDING = "PENDING"
}
export type TBooking = {
    id?: string;
    user_id: string;
    packages?: string[];
    total_amt: number;
    paymentStatus: PaymentStatus;
    approval_code?: string;
    receipt?: string;
    itinerary?: string;
};
export declare class BookingModel {
    id: string;
    user_id: string;
    packages: string;
    total_amt: number;
    paymentStatus: PaymentStatus;
    approval_code: string;
    receipt: string;
    itinerary: string;
    created_date: string;
    updated_date: string;
}
