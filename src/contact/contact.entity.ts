import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  contactNumber: number;

  @Column('text', { nullable: true })
  message?: string

  @Column({ type: 'date' })
  createDateTime: string;
}

