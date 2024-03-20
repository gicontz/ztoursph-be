export declare class TPaymentDTO {
    readonly referenceId?: string;
    readonly userId: string;
    readonly bookingId: string;
    readonly status: string;
    readonly amount: number;
    readonly currency: string;
    readonly paymentMethod: string;
    readonly paymentType: string;
    readonly paymentDate: Date;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}
export declare const PAYMENT_DTO_EXAMPLE: {
    paymentData: {
        userId: string;
        bookingId: string;
        amount: number;
        status: string;
        paymentType: string;
        success_response: string;
        failed_response: string;
    };
};
