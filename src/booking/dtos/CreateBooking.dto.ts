import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransformDate } from 'src/common/validation/transform-date.validator';

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

  @ApiPropertyOptional({
    description: 'Booked from date',
    example: '2024-03-15T00:00:00Z',
    type: Date,
  })
  @IsOptional()
  @IsDate()
  @TransformDate()
  readonly booked_from: Date;

  @ApiPropertyOptional({
    description: 'Booked to date',
    example: '2024-03-20T00:00:00Z',
    type: Date,
  })
  @IsOptional()
  @IsDate()
  @TransformDate()
  readonly booked_to: Date;
}
