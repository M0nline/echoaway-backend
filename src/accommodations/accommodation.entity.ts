import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type ConnectivityLevel = 'None' | 'Low' | 'High';

@Entity()
// TypeORM va créer une table PostgreSQL accommodation
export class Accommodation {
  @PrimaryGeneratedColumn() // autoincrément
  id: number;
  // TypeORM Déclare les colonnes de la table
  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  type: string;

  @Column({
    type: 'enum',
    enum: ['None', 'Low', 'High'],
    default: 'None',
  })
  connectivity: ConnectivityLevel;
}
