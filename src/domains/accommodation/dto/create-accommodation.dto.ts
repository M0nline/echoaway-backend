import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsPhoneNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { AccommodationType, ConnectivityType } from '../../../entities';

export class CreateAccommodationDto {
  @IsString()
  @Max(100)
  title: string;

  @IsNumber()
  hostId: number;

  @IsString()
  @Max(200)
  address: string;

  @IsString()
  @Max(10)
  postalCode: string;

  @IsString()
  @Max(100)
  city: string;

  @IsString()
  @IsIn(Object.values(AccommodationType))
  type: string;

  @IsNumber()
  @Min(1)
  numberOfBeds: number;

  @IsString()
  @IsIn(Object.values(ConnectivityType))
  connectivity: string;

  @IsNumber()
  @Min(0)
  priceMinPerNight: number;

  @IsNumber()
  @Min(0)
  priceMaxPerNight: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  bookingLink?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
