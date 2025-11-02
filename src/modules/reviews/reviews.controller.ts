import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Review } from '../../entity/review.entity';
import { CreateReviewDto } from './create_dto';

@Controller('reviews')
export class ReviewsController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.reviewsService.findById(id);
  }
@UseGuards(JwtAuthGuard)
@Get('user/me')
async findMyReviews(@Req() req: any): Promise<Review[]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const user = req.user as { id: number; username: string; email: string };
  return this.reviewsService.findByIdUserId(user.id);
}
// @Patch()
//   async updateReview(
//     @Param('id') id: number,
//     @Body() updateData: Partial<Review>,
//   ): Promise<Review> {
//     return this.reviewsService.update(id, updateData);
//   }

  @UseGuards(JwtAuthGuard)
@Delete(':id')
 
async deleteReview(@Param('id') id: number, @Req() req: any): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const user = req.user as { id: number };
  if (!user.id || isNaN(user.id)) {
    throw new BadRequestException('Invalid user ID in JWT token.');
  }
   
  return this.reviewsService.deleteByUser(id, user.id);
}

@UseGuards(JwtAuthGuard)
@Post()
async createReview(
  @Body() createReviewDto: CreateReviewDto,
  @Req() req: any, // Lấy thông tin từ JWT token
): Promise<Review> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const user = req.user as { id: number }; // Lấy userId từ JWT token

  // Kiểm tra và chuyển đổi userId sang số nguyên
  if (!user.id || isNaN(user.id)) {
    throw new BadRequestException('Invalid user ID in JWT token.');
  }

  createReviewDto.userId = Math.floor(Number(user.id)); // Đảm bảo userId là số nguyên
  return this.reviewsService.create(createReviewDto);
}
@UseGuards(JwtAuthGuard)
@Patch(':id')
async updateReviewByUser(
  @Param('id') id: number,
  @Body() updateData: Partial<Review>,
  @Req() req: any, // Lấy thông tin từ JWT token
): Promise<Review> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const user = req.user as { id: number }; // Lấy userId từ JWT token

  // Kiểm tra và chuyển đổi userId sang số nguyên
  if (!user.id || isNaN(user.id)) {
    throw new BadRequestException('Invalid user ID in JWT token.');
  }

  return this.reviewsService.updateByIdUser(id, user.id, updateData);
}
@Get('movie/:movieId')
findByMovieId(@Param('movieId') movieId: number) {
  return this.reviewsService.findByMovieId(movieId);
}

}