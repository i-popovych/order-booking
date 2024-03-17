import { IsString, IsBoolean, IsDate, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({
    description: 'The name of the room',
    example: '101a',
  })
  @IsString()
  readonly room: string;

  @ApiProperty({
    description: 'Maximum number of guests',
    example: 2,
  })
  @IsNumber()
  readonly max_guests: number;

  @ApiProperty({
    description: 'Price per night',
    example: 100,
  })
  @IsNumber()
  readonly price_per_night: number;

  @ApiProperty({
    description: 'Availability of WiFi',
    example: true,
  })
  @IsBoolean()
  readonly has_wifi: boolean;

  @ApiProperty({
    description: 'Availability of balcony',
    example: true,
  })
  @IsBoolean()
  readonly has_balcony: boolean;

  @ApiProperty({
    description: 'Available from date',
    example: '2024-03-15T00:00:00Z',
    type: Date,
  })
  @Transform(({ value }) => {
    return new Date(value);
  })
  @IsDate()
  readonly available_from: Date;

  @ApiProperty({
    description: 'Available to date',
    example: '2024-03-20T00:00:00Z',
    type: Date,
  })
  @Transform(({ value }) => {
    return new Date(value);
  })
  @IsDate()
  readonly available_to: Date;
}
