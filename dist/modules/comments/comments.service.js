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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const comment_entity_1 = require("../../entity/comment.entity");
const movie_entity_1 = require("../../entity/movie.entity");
const User_1 = require("../../entity/User");
const Repository_1 = require("typeorm/repository/Repository");
let CommentsService = class CommentsService {
    commentsRepository;
    usersRepository;
    moviesRepository;
    constructor(commentsRepository, usersRepository, moviesRepository) {
        this.commentsRepository = commentsRepository;
        this.usersRepository = usersRepository;
        this.moviesRepository = moviesRepository;
    }
    async findAll() {
        return this.commentsRepository.find({
            relations: ['user', 'movie']
        });
    }
    async findById(id) {
        return this.commentsRepository.findOneBy({ id });
    }
    async create(data) {
        const { content, userId, movieId } = data;
        const comment = this.commentsRepository.create({
            content,
            user: { id: userId },
            movie: { id: movieId },
        });
        return this.commentsRepository.save(comment);
    }
    async updateByUser(id, userId, updateData) {
        const comment = await this.commentsRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['user'],
        });
        if (!comment) {
            throw new common_1.BadRequestException(`Comment with ID ${id} does not exist or you do not have permission to update it.`);
        }
        Object.assign(comment, updateData);
        return this.commentsRepository.save(comment);
    }
    async deleteByUser(id, userId) {
        const comment = await this.commentsRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!comment) {
            throw new common_1.BadRequestException('Comment not found or you do not have permission to delete it');
        }
        await this.commentsRepository.remove(comment);
    }
    async delete(id) {
        await this.commentsRepository.delete(id);
    }
    async update(id, data) {
        const comment = await this.commentsRepository.findOne({ where: { id } });
        if (!comment) {
            throw new common_1.NotFoundException("Comment not found");
        }
        Object.assign(comment, data);
        return this.commentsRepository.save(comment);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(User_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __metadata("design:paramtypes", [Repository_1.Repository,
        Repository_1.Repository,
        Repository_1.Repository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map