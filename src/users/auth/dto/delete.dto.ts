import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'password',
    description: 'S3nhaF@RT!23',
  })
  password: string;
}
