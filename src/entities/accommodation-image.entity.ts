import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Accommodation } from './accommodation.entity';

@Entity('accommodation_images')
export class AccommodationImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  url: string;

  @Column({ nullable: true, length: 200 })
  caption: string;

  @Column()
  accommodationId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(
    () => Accommodation,
    (accommodation) => accommodation.accommodationImages,
  )
  @JoinColumn({ name: 'accommodationId' })
  accommodation: Accommodation;
}
