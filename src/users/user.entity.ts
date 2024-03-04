import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  customerId?: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: string;

  @Column('varchar', { unique: true })
  email?: string;

  @Column({ length: 100, nullable: true })
  password: string | undefined;

  @Column('varchar', { nullable: true })
  chat_id?: string;

  @Column({ nullable: true })
  picture?: string;

  @Column({ default: false })
  is_agree: boolean;

  @Column({ default: true })
  isFirstTime: boolean;

  @Column('varchar', { nullable: true })
  refreshToken?: string;
  @Column('varchar', { nullable: true })
  ad_account?: string;
}
