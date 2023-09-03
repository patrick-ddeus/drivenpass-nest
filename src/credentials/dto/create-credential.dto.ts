import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword, IsUrl } from 'class-validator';

export class CreateCredentialDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @ApiProperty()
  url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @ApiProperty()
  password: string;
}
