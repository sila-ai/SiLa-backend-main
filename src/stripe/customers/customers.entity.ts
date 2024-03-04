import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn} from 'typeorm';

@Entity()
export class Customers {
  
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  customerId: string;

  @Column()
  stripeObject: string;

  @Column({
    type: "text",
    nullable: true
  })
  address?: string;

  @Column()
  balance: number;

  @Column()
  created: number;

  @Column('varchar', {nullable: true})
  currency: string;

  @Column('varchar', {nullable: true})
  default_source?: string;

  @Column({ default: false })
  delinquent: boolean;

  @Column({
    type: "text",
    nullable: true
  })
  description?: string;

  @Column('varchar', {nullable: true})
  discount?: string;

  @Column({nullable: true})
  email?: string;

  @Column()
  invoice_prefix: string;

  @Column()
  invoice_settings: string;

  @Column({ default: false })
  livemode: boolean;

  @Column()
  metadata?: string;

  @Column({nullable: true})
  name?: string;

  @Column({ default: 1 })
  next_invoice_sequence: number;

  @Column('varchar', {nullable: true})
  phone?: string;

  @Column()
  preferred_locales?: string;

  @Column('varchar', {nullable: true})
  shipping?: string;

  @Column()
  tax_exempt: string;

  @Column({ default: false })
  cron_add?: boolean;

  @Column({ default: false })
  cron_update?: boolean;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

