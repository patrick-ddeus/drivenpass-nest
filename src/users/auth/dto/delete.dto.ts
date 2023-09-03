import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
