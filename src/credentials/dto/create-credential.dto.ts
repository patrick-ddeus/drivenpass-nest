import { IsNotEmpty, IsString, IsStrongPassword, IsUrl } from 'class-validator';

export class CreateCredentialDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string;
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}
