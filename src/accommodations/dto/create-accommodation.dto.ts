import { IsString, IsNumber, IsOptional, IsEnum, IsUrl, IsPhoneNumber, Min, Max, IsIn, MaxLength } from 'class-validator';
import { AccommodationType, ConnectivityType } from '../accommodation.entity';

export class CreateAccommodationDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(200)
  address: string;

  @IsString()
  @MaxLength(10)
  postalCode: string;

  @IsString()
  @MaxLength(100)
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
