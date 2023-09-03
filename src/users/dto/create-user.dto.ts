import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ name: 'email', example: 'fulano@teste.com' })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 10,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @ApiProperty({ name: 'password', example: 'S3nhaF@rt&' })
  password: string;
}
