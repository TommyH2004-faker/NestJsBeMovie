import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/Product';
import { UsersModule } from './modules/users/users.module';
import { User } from './entity/User';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { CommentsModule } from './modules/comments/comments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MoviesModule } from './modules/movies/movies.module';
import { GenresModule } from './modules/genres/genres.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { EpisodesModule } from './modules/episodes/episodes.module';
import { Genre } from './entity/genre.entity';
import { Review } from './entity/review.entity';
import { Favorite } from './entity/favorite.entity';
import { Episode } from './entity/episode.entity';
import { Movie } from './entity/movie.entity';
import { Comment } from './entity/comment.entity';
import { RoleModule } from './modules/role/role.module';
import { Role } from './entity/role.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { CloudinaryModule } from './modules/Cloundinary/cloudinary.module';
import { join } from 'path/win32';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ProductModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER, // ví dụ: yourname@gmail.com
          pass: process.env.MAIL_PASS, // App Password (không phải mật khẩu Gmail thường)
        },
      },
      defaults: {
        from: '"BookStore 👻" <yourname@gmail.com>',
      },
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Product,
        Movie,
        User,
        Review,
        Comment,
        Episode,
        Genre,
        Favorite,
        Role,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CommentsModule,
    EpisodesModule,
    FavoritesModule,
    GenresModule,
    MoviesModule,
    ReviewsModule,
    RoleModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log({
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      jwtSecret: process.env.JWT_SECRET,
      sendgridApiKey: process.env.SENDGRID_API_KEY,
    });
    console.log('MAIL_USER:', process.env.MAIL_USER);
    console.log('MAIL_PASS:', process.env.MAIL_PASS ? ' loaded' : ' missing');
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'product', method: RequestMethod.ALL }); // Áp dụng cho tất cả route của product
  }
}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     // Use the middleware globally or on specific routes
//     // consumer.apply(LoggingMiddleware).forRoutes('*'); // them toan cuc middleware
//     consumer
//       .apply(LoggingMiddleware)
//       .forRoutes(
//         { path: 'product', method: RequestMethod.ALL },
//         { path: 'product', method: RequestMethod.ALL },
//       ); // them chi dinh cua endpont
//     consumer.apply(RoleMiddleware).forRoutes('*');
//   }
// }
// #DB_TYPE=mysql
// ##DB_HOST=localhost
// #DB_HOST=db
// #DB_PORT=3306
// #DB_NAME=nestjs_db
// #DB_USER=spring_04
// #DB_PASSWORD=spring04
