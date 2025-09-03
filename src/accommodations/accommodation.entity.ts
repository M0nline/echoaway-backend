import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Favorite } from '../favorites/favorite.entity';
import { AccommodationImage } from '../accommodation-images/accommodation-image.entity';

export enum AccommodationType {
  APARTMENT = 'Appartement',
  HOUSE = 'Maison',
  CHALET = 'Chalet',
  CABANE = 'Cabane',
  TINY_HOUSE = 'Tiny house',
  YOURTE_TIPI = 'Yourte/Tipi',
  ROULOTTE = 'Roulotte',
  TROGLODYTE = 'Troglodyte',
  PHARE_REFUGE = 'Phare/Refuge',
}

export enum ConnectivityType {
  ZONE_BLANCHE = 'Zone blanche',
  ZONE_GRISE = 'Zone grise',
  AUTRE = 'Autre',
}

@Entity('accommodations')
export class Accommodation {
  // Identification
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ name: 'hostId' })
  hostId: number;

  @ManyToOne(() => User, (user) => user.accommodations)
  @JoinColumn({ name: 'hostId' })
  host: User;

  // Localisation
  @Column({ length: 200 })
  address: string;

  @Column({ length: 10 })
  postalCode: string;

  @Column({ length: 100 })
  city: string;

  // Caractéristiques
  @Column({
    type: 'enum',
    enum: AccommodationType,
    default: AccommodationType.HOUSE,
  })
  type: AccommodationType;

  @Column({ type: 'int' })
  numberOfBeds: number;

  @Column({
    type: 'enum',
    enum: ConnectivityType,
    default: ConnectivityType.ZONE_BLANCHE,
  })
  connectivity: ConnectivityType;

  // Tarification
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceMinPerNight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceMaxPerNight: number;

  // Contact/Réservation
  @Column({ nullable: true, type: 'text' })
  bookingLink?: string;

  @Column({ nullable: true, type: 'text' })
  phoneNumber?: string;

  // Métadonnées
  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Favorite, (favorite) => favorite.accommodation)
  favorites: Favorite[];

  @OneToMany(() => AccommodationImage, (image) => image.accommodation)
  accommodationImages: AccommodationImage[];

  // Méthodes métier
  getDetails() {
    return {
      id: this.id,
      title: this.title,
      address: this.address,
      postalCode: this.postalCode,
      city: this.city,
      type: this.type,
      connectivity: this.connectivity,
      description: this.description,
      priceMinPerNight: this.priceMinPerNight,
      priceMaxPerNight: this.priceMaxPerNight,
      numberOfBeds: this.numberOfBeds,
      bookingLink: this.bookingLink,
      phoneNumber: this.phoneNumber,
      createdAt: this.createdAt,
    };
  }

  // Méthode pour compter les favoris
  countFavorites(): number {
    return this.favorites ? this.favorites.length : 0;
  }
}
