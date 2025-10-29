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
exports.MoviesController = void 0;
const common_1 = require("@nestjs/common");
const movies_service_1 = require("./movies.service");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_storage_1 = require("../Cloundinary/cloudinary-storage");
let MoviesController = class MoviesController {
    moviesService;
    constructor(moviesService) {
        this.moviesService = moviesService;
    }
    async getAllMovies(page = 1, size = 10, sort = 'id:DESC') {
        const validatedPage = Math.max(1, Number(page));
        if (Number(size) === 0) {
            const movies = await this.moviesService.getAllMoviesWithoutPagination(sort);
            return {
                movies: movies,
                total: movies.length,
                page: 1,
                size: movies.length,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false,
            };
        }
        const validatedSize = Math.max(1, Math.min(100, Number(size)));
        return this.moviesService.getAllMovies(validatedPage, validatedSize, sort);
    }
    async getCountMovies() {
        return await this.moviesService.getCountMovies();
    }
    async findByMovieId(movieId) {
        const validatedMovieId = Number(movieId);
        if (isNaN(validatedMovieId)) {
            throw new common_1.BadRequestException('Invalid movie ID');
        }
        return await this.moviesService.findByMovieId(validatedMovieId);
    }
    async getAllMoviesWithoutPagination(sort = 'id:DESC') {
        const movies = await this.moviesService.getAllMoviesWithoutPagination(sort);
        return {
            movies: movies,
            total: movies.length,
            page: 1,
            size: movies.length,
            totalPages: 1,
        };
    }
    async getAllMoviesWithLimit(limit, sort = 'id:DESC') {
        const validatedLimit = limit && limit > 0 ? Math.min(limit, 1000) : undefined;
        const movies = await this.moviesService.getAllMoviesWithLimit(validatedLimit, sort);
        return {
            movies: movies,
            total: movies.length,
            limit: validatedLimit,
            sort: sort,
        };
    }
    async searchMovies(title, genreId, page = 1, size = 10, sort = 'id:DESC') {
        const validatedPage = Math.max(1, Number(page));
        const validatedSize = Math.max(1, Math.min(100, Number(size)));
        const validatedGenreId = genreId ? Number(genreId) : undefined;
        const cleanTitle = title?.trim() || undefined;
        console.log('Search params:', {
            title: cleanTitle,
            genreId: validatedGenreId,
            page: validatedPage,
            size: validatedSize
        });
        return this.moviesService.searchMoviesAdvanced(cleanTitle, validatedGenreId, validatedPage, validatedSize, sort);
    }
    async getNewMovies(page = 1, size = 10, sort = 'created_at:DESC') {
        const validatedPage = Math.max(1, Number(page));
        const validatedSize = Math.max(1, Math.min(100, Number(size)));
        return this.moviesService.getNewMovies(validatedPage, validatedSize, sort);
    }
    async getTopMovies() {
        return this.moviesService.getTopMovies();
    }
    async getMoviesByGenre(genreId, page = 1, size = 10, sort = 'id:DESC') {
        const validatedPage = Math.max(1, Number(page));
        const validatedSize = Math.max(1, Math.min(100, Number(size)));
        return this.moviesService.getMoviesByGenre(genreId, validatedPage, validatedSize, sort);
    }
    async getMoviesByGenreAlias(genreId, page = 1, size = 10, sort = 'id:DESC') {
        return this.getMoviesByGenre(genreId, page, size, sort);
    }
    async getMoviesByCountry(country, page = 1, size = 10, sort = 'id:DESC') {
        const validatedPage = Math.max(1, Number(page));
        const validatedSize = Math.max(1, Math.min(100, Number(size)));
        return this.moviesService.getMoviesByCountry(country, validatedPage, validatedSize, sort);
    }
    async getRelatedMovies(movieId, limit = 6) {
        const validatedLimit = Math.max(1, Math.min(20, Number(limit)));
        return this.moviesService.getRelatedMovies(movieId, validatedLimit);
    }
    async getPopularMovies(page = 1, size = 10) {
        const validatedPage = Math.max(1, Number(page));
        const validatedSize = Math.max(1, Math.min(100, Number(size)));
        return this.moviesService.getPopularMovies(validatedPage, validatedSize);
    }
    async getMovie(id) {
        return this.moviesService.findOne(id);
    }
    async createMovie(movieData) {
        if (!movieData.title) {
            throw new common_1.BadRequestException('Title is required');
        }
        if (!movieData.slug) {
            movieData.slug = movieData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }
        return this.moviesService.create(movieData);
    }
    async updateMovie(id, updateData) {
        await this.moviesService.findOne(id);
        return this.moviesService.update(id, updateData);
    }
    async deleteMovie(id) {
        await this.moviesService.findOne(id);
        await this.moviesService.remove(id);
        return { message: 'Xoá phim thành công' };
    }
    async incrementViews(id) {
        return this.moviesService.incrementViews(id);
    }
    async getMovieStats() {
        return this.moviesService.getMovieStatistics();
    }
    async getMovieFeedback(movieId) {
        return await this.moviesService.getCommentsAndReviewsByMovieId(movieId);
    }
    async getMovieBySlug(slug) {
        const movie = await this.moviesService.findMovieByGenreSlug(slug);
        if (!movie) {
            throw new common_1.NotFoundException(`Movie with slug "${slug}" not found`);
        }
        return movie;
    }
    uploadImages(files) {
        return {
            poster_url: files.poster ? files.poster[0].path : null,
            banner_url: files.banner ? files.banner[0].path : null,
        };
    }
};
exports.MoviesController = MoviesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getAllMovies", null);
__decorate([
    (0, common_1.Get)('count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getCountMovies", null);
__decorate([
    (0, common_1.Get)('movie/:movieId'),
    __param(0, (0, common_1.Param)('movieId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "findByMovieId", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getAllMoviesWithoutPagination", null);
__decorate([
    (0, common_1.Get)('all-with-limit'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getAllMoviesWithLimit", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('title')),
    __param(1, (0, common_1.Query)('genreId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('size')),
    __param(4, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "searchMovies", null);
__decorate([
    (0, common_1.Get)('new'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getNewMovies", null);
__decorate([
    (0, common_1.Get)('top'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getTopMovies", null);
__decorate([
    (0, common_1.Get)('genre/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getMoviesByGenre", null);
__decorate([
    (0, common_1.Get)('by-genre/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getMoviesByGenreAlias", null);
__decorate([
    (0, common_1.Get)('by-country/:country'),
    __param(0, (0, common_1.Param)('country')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getMoviesByCountry", null);
__decorate([
    (0, common_1.Get)('related/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getRelatedMovies", null);
__decorate([
    (0, common_1.Get)('popular'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getPopularMovies", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getMovie", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "createMovie", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "updateMovie", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "deleteMovie", null);
__decorate([
    (0, common_1.Post)(':id/view'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "incrementViews", null);
__decorate([
    (0, common_1.Get)('stats/summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getMovieStats", null);
__decorate([
    (0, common_1.Get)('feedback/:movieId'),
    __param(0, (0, common_1.Param)('movieId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getMovieFeedback", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getMovieBySlug", null);
__decorate([
    (0, common_1.Post)('upload-images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'poster', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
    ], { storage: cloudinary_storage_1.storage })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "uploadImages", null);
exports.MoviesController = MoviesController = __decorate([
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movies_service_1.MoviesService])
], MoviesController);
//# sourceMappingURL=movies.controller.js.map