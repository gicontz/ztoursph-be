import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
}

export enum UserSex {
  M = 'M',
  F = 'F',
}

export type TUser = {
  id?: string;
  first_name: string;
  last_name: string;
  middle_init: string | null;
  email: string;
  mobile_number1: string;
  mobile_number2: string;
  birthday: Date;
  sex: UserSex;
  role?: UserRole;
  enabled?: boolean;
  created_date?: Date;
};

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
  @Column({ type: 'text', nullable: false, unique: true })
  mobile_number1: string;
  @Column({ type: 'text', nullable: false, unique: true })
  mobile_number2: string;
  @Column({ enum: UserSex, nullable: false, unique: true })
  sex: UserSex;
  @Column({ type: 'date', nullable: false })
  birthday: Date;
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
    nullable: false,
  })
  role: UserRole;
  @Column({ type: 'boolean', default: true, nullable: false })
  enabled: boolean;
  @Column({ type: 'date', default: true, nullable: false })
  created_date: Date;
}
