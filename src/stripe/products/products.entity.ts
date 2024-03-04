import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Products {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  productId: string;

  @Column()
  stripeObject: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  attributes?: string;

  @Column()
  created: number;

  @Column({
    type: "text",
    nullable: true
  })
  description?: string;

  @Column()
  images?: string;

  @Column({ default: false })
  livemode: boolean;
  
  @Column()
  metadata?: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  package_dimensions?: string;

  @Column('varchar',{nullable: true})
  shippable?: string;

  @Column('varchar', {nullable: true})
  statement_descriptor?: string;

  @Column('varchar', {nullable: true})
  unit_label?: string;

  @Column()
  updated: number;
  
  @Column('varchar', {nullable: true})
  url?: string;

  @Column({ default: false })
  cron_add?: boolean;

  @Column({ default: false })
  cron_update?: boolean;
}

