import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Faker Title', description: 'title for Card' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '1111-1111-1111-1111', description: 'card number' })
  number: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Card 1', description: 'name for Card' })
  name: string;

  @IsDateString()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2023-12-02', description: "card's Expiration Date" })
  expirationDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '111', description: "card's secure code" })
  secureCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 's#nhaFoR1e', description: "card's password" })
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: 'true', description: 'if card is virtual or not' })
  isVirtual: boolean;

  @IsNotEmpty()
  @IsString()
  @IsEnum(CardType)
  @ApiProperty({ enum: CardType })
  type: CardType;
}
