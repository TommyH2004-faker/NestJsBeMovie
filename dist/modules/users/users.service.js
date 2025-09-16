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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("../../entity/User");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const role_entity_1 = require("../../entity/role.entity");
const mailer_service_1 = require("../../shared/mailer.service");
const crypto_1 = require("crypto");
let UsersService = class UsersService {
    userRepository;
    mailerService;
    roleRepository;
    constructor(userRepository, mailerService, roleRepository) {
        this.userRepository = userRepository;
        this.mailerService = mailerService;
        this.roleRepository = roleRepository;
    }
    async create(userData) {
        const user = this.userRepository.create(userData);
        user.enabled = false;
        user.activationCode = (0, crypto_1.randomBytes)(20).toString('hex');
        const role = await this.roleRepository.findOne({ where: { name: 'USER' } });
        if (role) {
            user.roles = [role];
        }
        user.password = await bcrypt.hash(user.password, 10);
        user.createdAt = new Date();
        user.updatedAt = new Date();
        const savedUser = await this.userRepository.save(user);
        const activationLink = `http://localhost:8080/kich-hoat/${savedUser.activationCode}`;
        await this.mailerService.sendActivationEmail(savedUser.email, activationLink);
        return savedUser;
    }
    findByEmail(email) {
        const user = this.userRepository.findOneBy({ email });
        return user;
    }
    async validateUser(email, password) {
        const user = await this.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
    async saveRefreshToken(refreshToken, userId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (user) {
            const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
            user.refreshToken = hashedRefreshToken;
            return this.userRepository.save(user);
        }
        return null;
    }
    async verityRefreshToken(refreshToken, userId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (user && user.refreshToken) {
            const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
            if (isMatch) {
                return user;
            }
        }
        return null;
    }
    async existsByEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        return !!user;
    }
    async existsByName(name) {
        const user = await this.userRepository.findOne({ where: { name } });
        return !!user;
    }
    async activateAccount(code) {
        const user = await this.userRepository.findOne({ where: { activationCode: code } });
        if (!user)
            return null;
        if (user.enabled) {
            return user;
        }
        user.enabled = true;
        return this.userRepository.save(user);
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)
            return false;
        const newPasswordPlain = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPasswordPlain, 10);
        user.password = hashedPassword;
        await this.userRepository.save(user);
        await this.mailerService.sendNewPassword(user.email, newPasswordPlain);
        return true;
    }
    getCountUsers() {
        return this.userRepository.count();
    }
    async getAllUsers() {
        return this.userRepository.find();
    }
    async getInfoUserById(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async ConfirmPassword(userId, password) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            return false;
        return await bcrypt.compare(password, user.password);
    }
    async updateInfoUser(id, userData) {
        await this.userRepository.update(id, userData);
        return this.userRepository.findOneBy({ id });
    }
    async deleteUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            return null;
        await this.userRepository.delete(id);
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mailer_service_1.MailerService,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map