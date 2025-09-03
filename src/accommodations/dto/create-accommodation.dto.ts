import { IsString, IsNumber, IsOptional, IsEnum, IsUrl, IsPhoneNumber, Min, Max } from 'class-validator';
import { AccommodationType, ConnectivityType } from '../accommodation.entity';

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

  @IsEnum(AccommodationType)
  type: AccommodationType;

  @IsNumber()
  @Min(1)
  numberOfBeds: number;

  @IsEnum(ConnectivityType)
  connectivity: ConnectivityType;

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
