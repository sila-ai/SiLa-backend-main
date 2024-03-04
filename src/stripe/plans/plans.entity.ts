import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Plans {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  planId: string;

  @Column()
  stripeObject: string;

  @Column({ default: true })
  active: boolean;

  @Column({nullable: true})
  aggregate_usage?: string;

  @Column()
  amount: number;

  @Column()
  amount_decimal: string;

  @Column()
  billing_scheme: string;

  @Column()
  created: number;

  @Column()
  currency: string;

  @Column()
  interval: string;

  @Column()
  interval_count: number;

  @Column({ default: false })
  livemode: boolean;

  @Column()
  metadata?: string;

  @Column({nullable: true})
  nickname?: string;

  @Column()
  product: string;

  @Column({
    nullable: true
  })
  tiers_mode?: string;

  @Column({nullable: true})
  transform_usage?: string;

  @Column({nullable: true})
  trial_period_days?: string;

  @Column()
  usage_type: string;

  @Column({ default: false })
  cron_add?: boolean;

  @Column({ default: false })
  cron_update?: boolean;
}

