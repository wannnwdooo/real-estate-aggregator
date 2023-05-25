import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ description: 'Email пользователя', required: true })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
