import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Store, store => store.owner)
  stores: Store[];

  @OneToMany(() => Rating, rating => rating.user)
  ratings: Rating[];
}