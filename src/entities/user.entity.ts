import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Accommodation } from './accommodation.entity';
import { Favorite } from './favorite.entity';

export enum UserRole {
  ADMIN = 'admin',
  HOST = 'host',
  GUEST = 'guest',
  VISITOR = 'visitor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ select: false, length: 255 })
  password: string;

  @Column({ length: 100 })
  firstname: string;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 255 })
  avatar?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VISITOR,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Accommodation, (accommodation) => accommodation.host)
  accommodations: Accommodation[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  // Méthodes utilitaires pour les rôles
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isHost(): boolean {
    return this.role === UserRole.HOST || this.role === UserRole.ADMIN;
  }

  isGuest(): boolean {
    return this.role === UserRole.GUEST;
  }

  isVisitor(): boolean {
    return this.role === UserRole.VISITOR;
  }
}
