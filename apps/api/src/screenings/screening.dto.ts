import { CreateScreeningInput } from '@badabing/shared';
import { IsString, IsNotEmpty, Max, IsInt, Min, IsOptional, IsUrl, IsUUID, IsISO8601, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScreeningDto implements CreateScreeningInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(600)
  description: string;

  @IsInt()
  @Min(1)
  @Max(10000)
  @Type(() => Number)
  capacity: number;

  @IsOptional()
  @IsUrl()
  posterUrl?: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  location: string;

  @IsOptional()
  @IsInt()
  @Min(2025)
  @Max(2100)
  @Type(() => Number)
  year?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  runtimeMinutes?: number | null;

  @IsUUID()
  hostId: string;

  @IsISO8601()
  startsAt: string;
}