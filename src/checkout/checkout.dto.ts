export class TPaymentDTO {
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
};

export type TCategory = 'tours' | 'packages';

export type TBookedTrip = {
    readonly id: string | number;
    readonly category?: TCategory;
    readonly pax: number;
    readonly date?: Date;
}

export class TPreCheckout {
    readonly booking: Array<TBookedTrip>;
}

export const PAYMENT_DTO_EXAMPLE = {
    paymentData: {
        userId: '123',
        bookingId: '123',
        amount: 1000,
        status: 'PENDING',
        paymentType: 'CREDIT CARD',
        success_response: '',
        failed_response: ''
    }
};