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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const reviews_service_1 = require("./reviews.service");
const jwt_auth_guard_1 = require("../../guards/jwt-auth.guard");
const create_dto_1 = require("./create_dto");
let ReviewsController = class ReviewsController {
    reviewsService;
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    findAll() {
        return this.reviewsService.findAll();
    }
    findById(id) {
        return this.reviewsService.findById(id);
    }
    async findMyReviews(req) {
        const user = req.user;
        return this.reviewsService.findByIdUserId(user.id);
    }
    async deleteReview(id, req) {
        const user = req.user;
        if (!user.id || isNaN(user.id)) {
            throw new common_1.BadRequestException('Invalid user ID in JWT token.');
        }
        return this.reviewsService.deleteByUser(id, user.id);
    }
    async createReview(createReviewDto, req) {
        const user = req.user;
        if (!user.id || isNaN(user.id)) {
            throw new common_1.BadRequestException('Invalid user ID in JWT token.');
        }
        createReviewDto.userId = Math.floor(Number(user.id));
        return this.reviewsService.create(createReviewDto);
    }
    async updateReviewByUser(id, updateData, req) {
        const user = req.user;
        if (!user.id || isNaN(user.id)) {
            throw new common_1.BadRequestException('Invalid user ID in JWT token.');
        }
        return this.reviewsService.updateByIdUser(id, user.id, updateData);
    }
    findByMovieId(movieId) {
        return this.reviewsService.findByMovieId(movieId);
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('user/me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "findMyReviews", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dto_1.CreateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "createReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "updateReviewByUser", null);
__decorate([
    (0, common_1.Get)('movie/:movieId'),
    __param(0, (0, common_1.Param)('movieId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findByMovieId", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map