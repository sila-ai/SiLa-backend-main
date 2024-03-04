import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  paymentId: string;

  @Column()
  stripeObject: string;

  @Column('text')
  billing_details: string;

  @Column('text')
  card: string;

  @Column()
  created: number;

  @Column({nullable: true})
  customer?: string;

  @Column({ default: false })
  livemode: boolean;

  @Column()
  metadata?: string;

  @Column()
  type?: string;
}

