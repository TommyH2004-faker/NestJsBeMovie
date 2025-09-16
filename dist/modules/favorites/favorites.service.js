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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const favorite_entity_1 = require("../../entity/favorite.entity");
const movie_entity_1 = require("../../entity/movie.entity");
const User_1 = require("../../entity/User");
const typeorm_2 = require("typeorm");
let FavoritesService = class FavoritesService {
    favoritesRepository;
    userRepository;
    movieRepository;
    constructor(favoritesRepository, userRepository, movieRepository) {
        this.favoritesRepository = favoritesRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }
    async findAll() {
        return this.favoritesRepository.find({
            relations: ['user', 'movie'],
        });
    }
    async deleteFavorite(id) {
        const favorite = await this.favoritesRepository.findOneBy({ id });
        if (!favorite) {
            throw new Error(`Favorite with ID ${id} does not exist.`);
        }
        await this.favoritesRepository.remove(favorite);
    }
    async findByUserId(userId) {
        return this.favoritesRepository.find({
            where: { user: { id: userId } },
            relations: ['movie'],
        });
    }
    async add(userId, movieId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const movie = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!user || !movie) {
            throw new common_1.BadRequestException('User and movie are required to create a favorite.');
        }
        const existing = await this.favoritesRepository
            .createQueryBuilder('fav')
            .where('fav.userId = :userId', { userId })
            .andWhere('fav.movieId = :movieId', { movieId })
            .getOne();
        if (existing) {
            throw new common_1.BadRequestException('This movie is already in your favorites.');
        }
        const fav = this.favoritesRepository.create({ user, movie });
        return this.favoritesRepository.save(fav);
    }
    async getFavoriteMovieIds(userId) {
        const favorites = await this.favoritesRepository.find({
            where: { user: { id: userId } },
            relations: ['movie'],
        });
        return favorites.map(fav => fav.movie.id);
    }
    async remove(userId, movieId) {
        const fav = await this.favoritesRepository.findOne({
            where: { user: { id: userId }, movie: { id: movieId } },
        });
        if (!fav)
            throw new common_1.NotFoundException('Favorite không tồn tại.');
        await this.favoritesRepository.remove(fav);
        return { message: 'Xóa favorite thành công' };
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __param(1, (0, typeorm_1.InjectRepository)(User_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map