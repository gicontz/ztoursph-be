export type TCheckout = {
    userId?: string;
    userEmail: string;
    first_name: string;
    last_name: string;
    middle_init: string;
    packages: string[];
    totalAmt: number;
}