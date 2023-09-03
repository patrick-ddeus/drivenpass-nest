import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotesDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Faker Title', description: 'title for note' })
  title: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'anything interest',
    description: 'description for note',
  })
  description: string;
}
