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
exports.FavoritesController = void 0;
const common_1 = require("@nestjs/common");
const favorites_service_1 = require("./favorites.service");
const jwt_auth_guard_1 = require("../../guards/jwt-auth.guard");
let FavoritesController = class FavoritesController {
    favoritesService;
    constructor(favoritesService) {
        this.favoritesService = favoritesService;
    }
    findAll() {
        return this.favoritesService.findAll();
    }
    async findByUserId(userId) {
        if (!userId) {
            throw new Error('User ID is required to find favorites.');
        }
        return this.favoritesService.findByUserId(userId);
    }
    async getFavoriteMovies(userId) {
        const movieIds = await this.favoritesService.getFavoriteMovieIds(userId);
        return movieIds;
    }
    async add(req, movieId) {
        const userId = req.user.id;
        if (!movieId) {
            throw new common_1.BadRequestException('movieId is required.');
        }
        return this.favoritesService.add(userId, movieId);
    }
    async remove(req, movieId) {
        const userId = req.user.sub;
        return this.favoritesService.remove(userId, movieId);
    }
};
exports.FavoritesController = FavoritesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)('get-favorite-movie/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "getFavoriteMovies", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('movieId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "add", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('remove/:movieId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('movieId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "remove", null);
exports.FavoritesController = FavoritesController = __decorate([
    (0, common_1.Controller)('favorites'),
    __metadata("design:paramtypes", [favorites_service_1.FavoritesService])
], FavoritesController);
//# sourceMappingURL=favorites.controller.js.map