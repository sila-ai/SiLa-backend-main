import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Prices {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  priceId: string;

  @Column()
  stripeObject: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  billing_scheme: string;

  @Column()
  created: number;

  @Column()
  currency: string;

  @Column({ default: false })
  livemode: boolean;

  @Column({
    nullable: true
  })
  lookup_key?: string;

  @Column()
  metadata?: string;

  @Column({nullable: true})
  nickname?: string;

  @Column()
  product: string;

  @Column()
  recurring: string;

  @Column({
    nullable: true
  })
  tiers_mode?: string;

  @Column({nullable: true})
  transform_quantity?: string;

  @Column()
  type: string;

  @Column()
  unit_amount: number;
  
  @Column()
  unit_amount_decimal: string;
}

