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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const UpdateDto_1 = require("./dto/UpdateDto");
const bcrypt = require("bcrypt");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_storage_1 = require("../Cloundinary/cloudinary-storage");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getCountUsers() {
        return await this.usersService.getCountUsers();
    }
    async createUser(userData) {
        return await this.usersService.create(userData);
    }
    async getAllUsers() {
        return await this.usersService.getAllUsers();
    }
    async updatePassword(id, { oldPassword, newPassword }) {
        const isMatch = await this.usersService.ConfirmPassword(id, oldPassword);
        if (!isMatch) {
            return { message: 'Old password is incorrect' };
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        const updatedUser = await this.usersService.updateInfoUser(id, { password: hashed });
        if (!updatedUser) {
            return { message: 'User not found' };
        }
        return { message: 'Password updated successfully' };
    }
    async getUserById(id) {
        return this.usersService.findOneWithReviews(id);
    }
    async updateUser1(id, userData) {
        const updatedUser = await this.usersService.updateInfoUser(id, userData);
        if (!updatedUser) {
            return { message: "User not found" };
        }
        return updatedUser;
    }
    async deleteUser(id) {
        const user = await this.usersService.deleteUser(id);
        if (!user) {
            return { message: 'User not found' };
        }
        return user;
    }
    async uploadAvatar(id, file) {
        if (!file)
            throw new common_1.BadRequestException('Không nhận được file');
        const avatarUrl = file.path;
        const updatedUser = await this.usersService.update(id, {
            avatar: avatarUrl,
        });
        if (!updatedUser)
            throw new common_1.BadRequestException('Không tìm thấy người dùng');
        return {
            avatar: updatedUser.avatar,
            message: 'Cập nhật ảnh đại diện thành công',
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCountUsers", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)('/user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Put)(':id/password'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateDto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser1", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)(':id/avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: cloudinary_storage_1.storage })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadAvatar", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map