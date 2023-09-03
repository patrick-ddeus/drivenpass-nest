import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotesDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;
}
