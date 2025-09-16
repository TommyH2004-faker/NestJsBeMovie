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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const review_entity_1 = require("../../entity/review.entity");
const Repository_1 = require("typeorm/repository/Repository");
let ReviewsService = class ReviewsService {
    reviewsRepository;
    constructor(reviewsRepository) {
        this.reviewsRepository = reviewsRepository;
    }
    async findAll() {
        return this.reviewsRepository.find({
            relations: ['user', 'movie']
        });
    }
    async findById(id) {
        return this.reviewsRepository.findOneBy({ id });
    }
    async delete(id) {
        const review = await this.reviewsRepository.findOneBy({ id });
        if (!review) {
            throw new Error(`Review with ID ${id} does not exist.`);
        }
        await this.reviewsRepository.remove(review);
    }
    async findByIdUserId(userId) {
        return this.reviewsRepository.find({
            where: { user: { id: userId } },
            relations: ['movie'],
        });
    }
    async update(id, updateData) {
        const review = await this.reviewsRepository.findOneBy({ id });
        if (!review) {
            throw new Error(`Review with ID ${id} does not exist.`);
        }
        Object.assign(review, updateData);
        return this.reviewsRepository.save(review);
    }
    async updateByIdUser(id, userId, updateData) {
        const review = await this.reviewsRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['user'],
        });
        if (!review) {
            throw new common_1.BadRequestException(`Review with ID ${id} does not exist or you do not have permission to update it.`);
        }
        Object.assign(review, updateData);
        return this.reviewsRepository.save(review);
    }
    async create(createReviewDto) {
        const { userId, movieId } = createReviewDto;
        const review = this.reviewsRepository.create({
            ...createReviewDto,
            user: { id: userId },
            movie: { id: movieId },
        });
        return this.reviewsRepository.save(review);
    }
    async findByMovieId(movieId) {
        return this.reviewsRepository.find({
            where: { movie: { id: movieId } },
            relations: ['user', 'movie'],
            order: { created_at: 'DESC' }
        });
    }
    async deleteByUser(reviewId, userId) {
        const review = await this.reviewsRepository.findOne({
            where: { id: reviewId, user: { id: userId } }
        });
        if (!review) {
            throw new common_1.BadRequestException('Review not found or you do not have permission to delete it');
        }
        await this.reviewsRepository.remove(review);
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [Repository_1.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map