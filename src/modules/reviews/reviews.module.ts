import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from '../../entity/review.entity';
import { MoviesModule } from '../movies/movies.module';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService], // Nếu cần sử dụng ReviewsService ở module khác
  imports: [TypeOrmModule.forFeature([Review]), MoviesModule], // Import các entity cần thiết
})
export class ReviewsModule {}
