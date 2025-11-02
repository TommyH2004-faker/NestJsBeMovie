import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '../../entity/genre.entity';
import { Review } from '../../entity/review.entity';
import { Movie } from '../../entity/movie.entity';
import { CommentsModule } from '../comments/comments.module';
import { MoviesModule } from '../movies/movies.module'; // ✅ import MoviesModule

@Module({
  controllers: [GenresController],
  providers: [GenresService],
  exports: [GenresService],
  imports: [
    TypeOrmModule.forFeature([Genre, Review, Movie]),
    CommentsModule,
    MoviesModule, // ✅ thêm vào
  ],
})
export class GenresModule {}
