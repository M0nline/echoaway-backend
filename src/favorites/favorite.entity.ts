import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Accommodation } from '../accommodations/accommodation.entity';

@Entity('favorites')
@Unique(['userId', 'accommodationId'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  accommodationId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Accommodation, (accommodation) => accommodation.favorites)
  @JoinColumn({ name: 'accommodationId' })
  accommodation: Accommodation;
}
