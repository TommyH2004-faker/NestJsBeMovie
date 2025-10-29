"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const product_module_1 = require("./modules/product/product.module");
const typeorm_1 = require("@nestjs/typeorm");
const Product_1 = require("./entity/Product");
const users_module_1 = require("./modules/users/users.module");
const User_1 = require("./entity/User");
const auth_module_1 = require("./modules/auth/auth.module");
const config_1 = require("@nestjs/config");
const logger_middleware_1 = require("./middleware/logger/logger.middleware");
const comments_module_1 = require("./modules/comments/comments.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const movies_module_1 = require("./modules/movies/movies.module");
const genres_module_1 = require("./modules/genres/genres.module");
const favorites_module_1 = require("./modules/favorites/favorites.module");
const episodes_module_1 = require("./modules/episodes/episodes.module");
const genre_entity_1 = require("./entity/genre.entity");
const review_entity_1 = require("./entity/review.entity");
const favorite_entity_1 = require("./entity/favorite.entity");
const episode_entity_1 = require("./entity/episode.entity");
const movie_entity_1 = require("./entity/movie.entity");
const comment_entity_1 = require("./entity/comment.entity");
const role_module_1 = require("./modules/role/role.module");
const role_entity_1 = require("./entity/role.entity");
const mailer_1 = require("@nestjs-modules/mailer");
const cloudinary_module_1 = require("./modules/Cloundinary/cloudinary.module");
const win32_1 = require("path/win32");
const serve_static_1 = require("@nestjs/serve-static");
let AppModule = class AppModule {
    constructor() {
        console.log({
            type: process.env.DB_TYPE,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            jwtSecret: process.env.JWT_SECRET,
        });
        console.log('MAIL_USER:', process.env.MAIL_USER);
        console.log('MAIL_PASS:', process.env.MAIL_PASS ? ' loaded' : ' missing');
    }
    configure(consumer) {
        consumer
            .apply(logger_middleware_1.LoggerMiddleware)
            .forRoutes({ path: 'product', method: common_1.RequestMethod.ALL });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, win32_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            product_module_1.ProductModule,
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS,
                    },
                },
                defaults: {
                    from: '"BookStore 👻" <yourname@gmail.com>',
                },
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: process.env.DB_TYPE,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [
                    Product_1.Product,
                    movie_entity_1.Movie,
                    User_1.User,
                    review_entity_1.Review,
                    comment_entity_1.Comment,
                    episode_entity_1.Episode,
                    genre_entity_1.Genre,
                    favorite_entity_1.Favorite,
                    role_entity_1.Role,
                ],
                synchronize: true,
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            comments_module_1.CommentsModule,
            episodes_module_1.EpisodesModule,
            favorites_module_1.FavoritesModule,
            genres_module_1.GenresModule,
            movies_module_1.MoviesModule,
            reviews_module_1.ReviewsModule,
            role_module_1.RoleModule,
            cloudinary_module_1.CloudinaryModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [])
], AppModule);
//# sourceMappingURL=app.module.js.map