export type TCheckout = {
    userId?: string;
    userEmail: string;
    first_name: string;
    last_name: string;
    middle_init: string;
    packages: string[];
    totalAmt: number;
};
export declare enum TCheckoutPaymentStatus {
    PENDING = "PENDING",
    FAILED = "FAILED",
    SUCCESS = "SUCCESS"
}
export declare enum TPaymentType {
    CREDIT_CARD = "CREDIT CARD",
    E_WALLET = "E-WALLET"
}
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
export declare class CheckoutModel {
    referenceId: string;
    userId: string;
    bookingId: string;
    amount: number;
    status: TCheckoutPaymentStatus;
    paymentType: TPaymentType;
    receiptNumber: string;
    success_response: string;
    failed_response: string;
    createdAt: Date;
    updatedAt: Date;
}
