import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

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
}
