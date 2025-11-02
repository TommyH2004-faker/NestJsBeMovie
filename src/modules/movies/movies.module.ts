import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from '../../entity/movie.entity';
import { Review } from '../../entity/review.entity';
import { Comment } from '../../entity/comment.entity';
import { Genre } from '../../entity/genre.entity';
import { Favorite } from '@src/entity/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Review, Comment, Genre, Favorite]), // ✅ Chỉ cần dòng này
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
