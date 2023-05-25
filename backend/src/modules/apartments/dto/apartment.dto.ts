import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ApartmentDto {
  @ApiProperty({ description: 'Номер квартиры', required: true })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  number: number;

  @ApiProperty({ description: 'Количество комнат', required: true })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  rooms: number;

  @ApiProperty({ description: 'Площадь', required: true })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  area: number;

  @ApiProperty({ description: 'Этаж', required: true })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  floor: number;

  @ApiProperty({ description: 'Цена', required: true })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
