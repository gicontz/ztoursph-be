import { TResponseData } from 'src/http.types';
import { TPaymentResponse } from './maya.dto';
export type TMayaPayment = {
    totalAmount: {
        value: number;
        currency: string;
    };
    requestReferenceNumber: string;
};
export declare class MayaService {
    private cnfg;
    private FACE_API_KEY;
    private SECRET_KEY;
    private CHECKOUT_API;
    constructor();
    checkout(data?: TMayaPayment): Promise<TResponseData | null>;
    verifyPayment(res: TPaymentResponse): import("./maya.dto").TPaymentStatus;
}
