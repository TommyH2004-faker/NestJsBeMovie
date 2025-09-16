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
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movie_entity_1 = require("../../entity/movie.entity");
const review_entity_1 = require("../../entity/review.entity");
const comment_entity_1 = require("../../entity/comment.entity");
const genre_entity_1 = require("../../entity/genre.entity");
let MoviesService = class MoviesService {
    moviesRepository;
    reviewsRepository;
    genreRepository;
    commentsRepository;
    constructor(moviesRepository, reviewsRepository, genreRepository, commentsRepository) {
        this.moviesRepository = moviesRepository;
        this.reviewsRepository = reviewsRepository;
        this.genreRepository = genreRepository;
        this.commentsRepository = commentsRepository;
    }
    findAll() {
        return this.moviesRepository.find();
    }
    async searchMoviesAdvanced(title, genreId, page = 1, size = 10, sort = 'id:DESC') {
        try {
            const [sortField, sortDirection] = this.parseSortParameter(sort);
            let queryBuilder = this.moviesRepository
                .createQueryBuilder('movie')
                .leftJoinAndSelect('movie.genres', 'genre');
            const whereConditions = [];
            const parameters = {};
            if (title && title.length > 0) {
                whereConditions.push('(movie.title LIKE :title OR movie.original_title LIKE :title OR movie.description LIKE :title)');
                parameters.title = `%${title}%`;
            }
            if (genreId && genreId > 0) {
                whereConditions.push('genre.id = :genreId');
                parameters.genreId = genreId;
            }
            if (whereConditions.length > 0) {
                queryBuilder = queryBuilder.where(whereConditions.join(' AND '), parameters);
            }
            queryBuilder = queryBuilder.orderBy(`movie.${sortField}`, sortDirection);
            const total = await queryBuilder.getCount();
            const movies = await queryBuilder
                .skip((page - 1) * size)
                .take(size)
                .getMany();
            const totalPages = Math.ceil(total / size);
            return {
                movies,
                total,
                page,
                size,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            };
        }
        catch (error) {
            console.error('Search error:', error);
            throw new common_1.BadRequestException(`Error in advanced search: ${error.message}`);
        }
    }
    async getMoviesByGenre(genreId, page = 1, size = 10, sort = 'id:DESC') {
        try {
            const [sortField, sortDirection] = this.parseSortParameter(sort);
            const queryBuilder = this.moviesRepository
                .createQueryBuilder('movie')
                .leftJoinAndSelect('movie.genres', 'genre')
                .where('genre.id = :genreId', { genreId })
                .orderBy(`movie.${sortField}`, sortDirection);
            const total = await queryBuilder.getCount();
            const movies = await queryBuilder
                .skip((page - 1) * size)
                .take(size)
                .getMany();
            const totalPages = Math.ceil(total / size);
            return {
                movies,
                total,
                page,
                size,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching movies by genre: ${error.message}`);
        }
    }
    async getMoviesByCountry(country, page = 1, size = 10, sort = 'id:DESC') {
        try {
            const [sortField, sortDirection] = this.parseSortParameter(sort);
            const queryBuilder = this.moviesRepository
                .createQueryBuilder('movie')
                .leftJoinAndSelect('movie.genres', 'genre')
                .where('movie.country LIKE :country', { country: `%${country}%` })
                .orderBy(`movie.${sortField}`, sortDirection);
            const total = await queryBuilder.getCount();
            const movies = await queryBuilder
                .skip((page - 1) * size)
                .take(size)
                .getMany();
            const totalPages = Math.ceil(total / size);
            return {
                movies,
                total,
                page,
                size,
                totalPages,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching movies by country: ${error.message}`);
        }
    }
    async getAllMoviesWithoutPagination(sort = 'id:DESC') {
        try {
            const [sortField, sortDirection] = this.parseSortParameter(sort);
            return await this.moviesRepository.find({
                relations: ['genres'],
                order: { [sortField]: sortDirection },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error retrieving all movies: ${error.message}`);
        }
    }
    async getAllMoviesWithLimit(limit, sort = 'id:DESC') {
        try {
            const [sortField, sortDirection] = this.parseSortParameter(sort);
            const queryOptions = {
                relations: ['genres'],
                order: { [sortField]: sortDirection },
            };
            if (limit && limit > 0) {
                queryOptions.take = limit;
            }
            return await this.moviesRepository.find(queryOptions);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error retrieving movies with limit: ${error.message}`);
        }
    }
    async getAllMovies(page, size, sort) {
        try {
            const [sortField, sortDirection] = this.parseSortParameter(sort);
            const queryBuilder = this.moviesRepository
                .createQueryBuilder('movie')
                .leftJoinAndSelect('movie.genres', 'genre')
                .orderBy(`movie.${sortField}`, sortDirection);
            const total = await queryBuilder.getCount();
            const movies = await queryBuilder
                .skip((page - 1) * size)
                .take(size)
                .getMany();
            const totalPages = Math.ceil(total / size);
            return {
                movies,
                total,
                page,
                size,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching movies: ${error.message}`);
        }
    }
    async getNewMovies(page = 1, size = 10, sort = 'created_at:DESC') {
        try {
            const [sortField, sortDirection] = this.parseSortParameter(sort);
            const queryBuilder = this.moviesRepository
                .createQueryBuilder('movie')
                .leftJoinAndSelect('movie.genres', 'genre')
                .orderBy(`movie.${sortField}`, sortDirection);
            const total = await queryBuilder.getCount();
            const movies = await queryBuilder
                .skip((page - 1) * size)
                .take(size)
                .getMany();
            const totalPages = Math.ceil(total / size);
            return {
                movies,
                total,
                page,
                size,
                totalPages,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching new movies: ${error.message}`);
        }
    }
    async getPopularMovies(page = 1, size = 10) {
        try {
            const queryBuilder = this.moviesRepository
                .createQueryBuilder('movie')
                .leftJoinAndSelect('movie.genres', 'genre')
                .where('movie.views > :minViews', { minViews: 100 })
                .orderBy('movie.views', 'DESC')
                .addOrderBy('movie.rating', 'DESC');
            const total = await queryBuilder.getCount();
            const movies = await queryBuilder
                .skip((page - 1) * size)
                .take(size)
                .getMany();
            const totalPages = Math.ceil(total / size);
            return {
                movies,
                total,
                page,
                size,
                totalPages,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching popular movies: ${error.message}`);
        }
    }
    async getRelatedMovies(movieId, limit = 6) {
        try {
            const originalMovie = await this.moviesRepository.findOne({
                where: { id: movieId },
                relations: ['genres'],
            });
            if (!originalMovie) {
                throw new common_1.NotFoundException(`Movie with ID ${movieId} not found`);
            }
            const genreIds = originalMovie.genres.map(genre => genre.id);
            if (genreIds.length === 0) {
                const movies = await this.moviesRepository
                    .createQueryBuilder('movie')
                    .leftJoinAndSelect('movie.genres', 'genre')
                    .where('movie.id != :movieId', { movieId })
                    .orderBy('RANDOM()')
                    .take(limit)
                    .getMany();
                return { movies, total: movies.length };
            }
            const movies = await this.moviesRepository
                .createQueryBuilder('movie')
                .leftJoinAndSelect('movie.genres', 'genre')
                .where('movie.id != :movieId', { movieId })
                .andWhere('genre.id IN (:...genreIds)', { genreIds })
                .orderBy('movie.rating', 'DESC')
                .addOrderBy('movie.views', 'DESC')
                .take(limit)
                .getMany();
            return {
                movies,
                total: movies.length,
                relatedBy: 'genre',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching related movies: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            const movie = await this.moviesRepository.findOne({
                where: { id },
                relations: ['genres', 'episodes', 'comments', 'reviews'],
            });
            if (!movie) {
                throw new common_1.NotFoundException(`Movie with ID ${id} not found`);
            }
            return movie;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Error finding movie: ${error.message}`);
        }
    }
    async create(movieData) {
        try {
            const movie = this.moviesRepository.create({
                ...movieData,
                views: 0,
                created_at: new Date(),
                updated_at: new Date(),
            });
            return await this.moviesRepository.save(movie);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error creating movie: ${error.message}`);
        }
    }
    async update(id, updateData) {
        try {
            const movie = await this.moviesRepository.findOne({
                where: { id },
                relations: ['genres'],
            });
            if (!movie) {
                throw new common_1.NotFoundException(`Movie with ID ${id} not found`);
            }
            if (updateData.genres) {
                const genreIds = updateData.genres.map((g) => g.id || g);
                const genres = await this.genreRepository.findByIds(genreIds);
                movie.genres = genres;
            }
            Object.assign(movie, {
                ...updateData,
                updated_at: new Date(),
            });
            return await this.moviesRepository.save(movie);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error updating movie: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const result = await this.moviesRepository.delete(id);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Movie with ID ${id} not found`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Error deleting movie: ${error.message}`);
        }
    }
    async incrementViews(id) {
        try {
            await this.moviesRepository.increment({ id }, 'views', 1);
            return this.findOne(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error incrementing views: ${error.message}`);
        }
    }
    async getMovieStatistics() {
        try {
            const total = await this.moviesRepository.count();
            const totalViews = await this.moviesRepository
                .createQueryBuilder('movie')
                .select('SUM(movie.views)', 'totalViews')
                .getRawOne();
            const avgRating = await this.moviesRepository
                .createQueryBuilder('movie')
                .select('AVG(movie.rating)', 'avgRating')
                .where('movie.rating IS NOT NULL')
                .getRawOne();
            const topGenres = await this.moviesRepository
                .createQueryBuilder('movie')
                .leftJoin('movie.genres', 'genre')
                .select('genre.name', 'genreName')
                .addSelect('COUNT(movie.id)', 'movieCount')
                .groupBy('genre.id')
                .orderBy('movieCount', 'DESC')
                .limit(5)
                .getRawMany();
            return {
                totalMovies: total,
                totalViews: totalViews?.totalViews || 0,
                averageRating: parseFloat(avgRating?.avgRating || 0).toFixed(2),
                topGenres,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error getting statistics: ${error.message}`);
        }
    }
    parseSortParameter(sort) {
        const validSortFields = [
            'id', 'title', 'original_title', 'release_date',
            'rating', 'views', 'created_at', 'updated_at', 'duration'
        ];
        if (!sort || !sort.includes(':')) {
            return ['id', 'DESC'];
        }
        const [field, direction] = sort.split(':');
        const sortField = validSortFields.includes(field) ? field : 'id';
        const sortDirection = (direction?.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
        return [sortField, sortDirection];
    }
    async findByMovieId(movieId) {
        try {
            return await this.reviewsRepository.find({
                where: { movie: { id: movieId } },
                relations: ['user', 'movie'],
                order: { created_at: 'DESC' },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching reviews for movie ${movieId}: ${error.message}`);
        }
    }
    async getCommentsAndReviewsByMovieId(movieId) {
        try {
            const movieExists = await this.moviesRepository.findOne({
                where: { id: movieId },
                select: ['id', 'title']
            });
            if (!movieExists) {
                throw new common_1.NotFoundException(`Movie with ID ${movieId} not found`);
            }
            const reviews = await this.reviewsRepository
                .createQueryBuilder('review')
                .leftJoinAndSelect('review.user', 'user')
                .where('review.movieId = :movieId', { movieId })
                .orderBy('review.created_at', 'DESC')
                .getMany();
            const comments = await this.commentsRepository
                .createQueryBuilder('comment')
                .leftJoinAndSelect('comment.user', 'user')
                .where('comment.movieId = :movieId', { movieId })
                .orderBy('comment.created_at', 'DESC')
                .getMany();
            return {
                movieId,
                movieTitle: movieExists.title,
                reviews,
                comments,
                stats: {
                    totalReviews: reviews.length,
                    totalComments: comments.length,
                    totalFeedback: reviews.length + comments.length,
                    averageRating: reviews.length > 0
                        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                        : 0
                }
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Error fetching feedback for movie ${movieId}: ${error.message}`);
        }
    }
    async findMovieByGenreSlug(slug, size) {
        return this.moviesRepository.find({
            where: { genres: { slug } },
            relations: ['genres', 'reviews'],
            take: size || undefined,
        });
    }
    async getTopMovies() {
        try {
            const movies = await this.moviesRepository
                .createQueryBuilder('movie')
                .leftJoinAndSelect('movie.genres', 'genre')
                .orderBy('movie.views', 'DESC')
                .addOrderBy('movie.rating', 'DESC')
                .take(10)
                .getMany();
            return {
                movies,
                total: movies.length,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching top movies: ${error.message}`);
        }
    }
    getCountMovies() {
        return this.moviesRepository.count();
    }
};
exports.MoviesService = MoviesService;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MoviesService.prototype, "findAll", null);
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __param(1, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(2, (0, typeorm_1.InjectRepository)(genre_entity_1.Genre)),
    __param(3, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MoviesService);
//# sourceMappingURL=movies.service.js.map