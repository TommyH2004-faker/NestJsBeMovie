// dto/update-review.dto.ts
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  // eslint-disable-next-line prettier/prettier
  comment?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
