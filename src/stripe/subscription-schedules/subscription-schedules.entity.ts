import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class SubscriptionSchedules {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  subcriptionSchedulesId: string;

  @Column()
  stripeObject: string;

  @Column({nullable: true})
  canceled_at?: string;

  @Column({nullable: true})
  completed_at?: string;

  @Column()
  created: number;

  @Column({nullable: true})
  current_phase?: string;

  @Column()
  customer: string;

  @Column('text')
  default_settings: string;

  @Column()
  end_behavior: string;

  @Column({ default: false })
  livemode: boolean;

  @Column()
  metadata?: string;

  @Column('text')
  phases: string;
  
  @Column({nullable: true})
  released_at?: number;

  @Column({nullable: true})
  released_subscription?: string;

  @Column()
  status: string;

  @Column({nullable: true})
  renewal_interval?: string;

  @Column({nullable: true})
  subscription?: string;

  @Column({ default: false })
  cron_add?: boolean;

  @Column({ default: false })
  cron_update?: boolean;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

