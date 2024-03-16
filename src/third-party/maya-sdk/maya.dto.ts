// Payment Response from Maya
export type TPaymentResponse = {
    id: string;
    isPaid: boolean;
    status: string;
    amount: string;
    currency: string;
    canVoid: boolean;
    canRefund: boolean;
    canCapture: boolean;
    createdAt: string;
    updatedAt: string;
    description: string;
    paymentTokenId: string;
    fundSource: {
        type: string;
        id: string | null;
        description: string;
        details: {
            scheme: string;
            last4: string;
            first6: string;
            masked: string;
            issuer: string;
        }
    };
    receipt: {
        transactionId: string;
        receiptNo: string;
        approval_code: string;
        approvalCode: string;
    };
    metadata: any;
    approvalCode: string;
    receiptNumber: string;
    requestReferenceNumber: string;
};