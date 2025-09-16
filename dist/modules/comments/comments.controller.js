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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const comments_service_1 = require("./comments.service");
const jwt_auth_guard_1 = require("../../guards/jwt-auth.guard");
let CommentsController = class CommentsController {
    commentsService;
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    findAll() {
        return this.commentsService.findAll();
    }
    findById(id) {
        return this.commentsService.findById(id);
    }
    async createComment(data, req) {
        const user = req.user;
        if (!user.id || isNaN(user.id)) {
            throw new common_1.BadRequestException('Invalid user ID in JWT token.');
        }
        if (!data.content || !data.movieId) {
            throw new common_1.BadRequestException('Content and movieId are required.');
        }
        return this.commentsService.create({
            content: data.content,
            userId: user.id,
            movieId: data.movieId,
        });
    }
    async updateComment(id, updateData, req) {
        const user = req.user;
        if (!user.id || isNaN(user.id)) {
            throw new common_1.BadRequestException('Invalid user ID in JWT token.');
        }
        if (!updateData.content) {
            throw new common_1.BadRequestException('Content is required for updating a comment.');
        }
        return this.commentsService.updateByUser(id, user.id, updateData);
    }
    async deleteComment(id, req) {
        const user = req.user;
        if (!user.id || isNaN(user.id)) {
            throw new common_1.BadRequestException('Invalid user ID in JWT token.');
        }
        return this.commentsService.deleteByUser(id, user.id);
    }
    async deleteComment2(id) {
        await this.commentsService.delete(id);
    }
    async update(id, data) {
        return this.commentsService.update(id, data);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "findById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "createComment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "updateComment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Delete)('/comment/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "deleteComment2", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "update", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map