import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../entity/comment.entity';
import { User } from '../../entity/User';
import { Movie } from '../../entity/movie.entity';
import { MoviesModule } from '../movies/movies.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService], // ❌ KHÔNG đưa MoviesService vào đây!
  exports: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([Comment, User, Movie]),
    MoviesModule, // ✅ Import MoviesModule để dùng MoviesService qua DI
  ],
})
export class CommentsModule {}
