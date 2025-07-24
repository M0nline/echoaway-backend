import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export type ConnectivityLevel = 'None' | 'Low' | 'High';

@Entity('accommodations')
export class Accommodation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ length: 500 })
  @IsString()
  @IsNotEmpty()
  location: string;

  @Column({ length: 100 })
  @IsString()
  @IsNotEmpty()
  type: string;

  @Column({
    type: 'enum',
    enum: ['None', 'Low', 'High'],
    default: 'None',
  })
  @IsEnum(['None', 'Low', 'High'])
  connectivity: ConnectivityLevel;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerNight?: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  numberOfRooms?: number;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
