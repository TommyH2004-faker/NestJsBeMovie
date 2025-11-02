// src/genres/dto/update-genre.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateGenreDto {
  @IsOptional()
  @IsString()
  // eslint-disable-next-line prettier/prettier
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
