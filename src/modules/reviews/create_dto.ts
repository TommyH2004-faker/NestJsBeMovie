import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1, { message: 'movieId must be a positive integer' })
  movieId: number;

@IsInt({ message: 'userId must be an integer number' })
  @IsOptional() // Đặt userId là tùy chọn
  // eslint-disable-next-line prettier/prettier
  userId?: number;


  @IsString({ message: 'Comment must be a string' })
  @IsOptional()
   
  comment?: string;

  @IsInt()
  @Min(1, { message: 'Rating must be a positive integer' })
  rating: number;
}