import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
    DEVELOPER = 'DEVELOPER'
};

export type TUser = {
    id?: string;
    first_name: string;
    last_name: string;
    middle_init: string | null;
    email: string;
    signup_date: Date;
    role?: UserRole;
    enabled?: boolean;
}

@Entity({ name: 'users' })
export class UserModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'text', nullable: false })
    first_name: string;
    @Column({ type: 'text', nullable: false })
    middle_init: string;
    @Column({ type: 'text', nullable: false })
    last_name: string;
    @Column({ type: 'text', nullable: false, unique: true })
    email: string;
    @Column({ type: 'date', nullable: false })
    signup_date: Date;
    @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER, nullable: false })
    role: UserRole;
    @Column({ type: 'boolean', default: true, nullable: false })
    enabled: boolean;
}