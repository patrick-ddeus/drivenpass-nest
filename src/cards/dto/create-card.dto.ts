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
  title: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDateString()
  @IsString()
  @IsNotEmpty()
  expirationDate: Date;

  @IsNotEmpty()
  @IsString()
  secureCode: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  isVirtual: boolean;

  @IsNotEmpty()
  @IsString()
  @IsEnum(CardType)
  type: CardType;
}
