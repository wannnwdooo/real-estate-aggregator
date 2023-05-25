import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  DEFAULT = 'default',
  ADMIN = 'admin',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  hashedRefreshToken: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.DEFAULT })
  role: string;
}
