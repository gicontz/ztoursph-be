export declare enum UserRole {
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN",
    DEVELOPER = "DEVELOPER"
}
export type TUser = {
    id?: string;
    first_name: string;
    last_name: string;
    middle_init: string | null;
    email: string;
    signup_date: Date;
    role?: UserRole;
    enabled?: boolean;
};
export declare class UserModel {
    id: string;
    first_name: string;
    middle_init: string;
    last_name: string;
    email: string;
    signup_date: Date;
    role: UserRole;
    enabled: boolean;
}
