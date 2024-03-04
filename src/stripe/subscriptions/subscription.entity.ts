import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  subscriptionId: string;

  @Column()
  stripeObject: string;

  @Column({ nullable: true })
  application_fee_percent?: string;

  @Column()
  billing_cycle_anchor: number;

  @Column({ nullable: true })
  billing_thresholds?: string;

  @Column({ nullable: true })
  cancel_at?: string;

  @Column({ default: false })
  cancel_at_period_end: boolean;

  @Column({ nullable: true })
  canceled_at?: string;

  @Column()
  collection_method: string;

  @Column()
  created: number;

  @Column()
  current_period_end: number;

  @Column()
  current_period_start: number;

  @Column()
  customer: string;

  @Column({ nullable: true })
  days_until_due?: string;

  @Column({ nullable: true })
  default_payment_method: string;

  @Column({ nullable: true })
  default_source?: string;

  @Column()
  default_tax_rates?: string;

  @Column({ nullable: true })
  discount?: string;

  @Column({ nullable: true })
  ended_at?: string;

  @Column('text')
  items: string;

  @Column()
  latest_invoice: string;

  @Column({ default: false })
  livemode: boolean;

  @Column()
  metadata?: string;

  @Column({ nullable: true })
  next_pending_invoice_item_invoice?: string;

  @Column({ nullable: true })
  pause_collection?: string;

  @Column({ nullable: true })
  pending_invoice_item_interval?: string;

  @Column({ nullable: true })
  pending_setup_intent?: string;

  @Column({ nullable: true })
  pending_update?: string;

  @Column({ nullable: true })
  schedule?: string;

  @Column({ nullable: true })
  start_date?: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  transfer_data?: string;

  @Column({ nullable: true })
  trial_end?: string;

  @Column({ nullable: true })
  trial_start?: string;

  @Column({ default: false })
  cron_add?: boolean;

  @Column({ default: false })
  cron_update?: boolean;
  @Column({ default: 0 })
  total_clicks?: number;
  @Column({ default: 0 })
  bought_click?: number;

  @Column({ default: 0 })
  userId?: number;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
