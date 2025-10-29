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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const local_auth_guard_1 = require("../../guards/local-auth.guard");
const jwt_auth_guard_1 = require("../../guards/jwt-auth.guard");
const users_service_1 = require("../users/users.service");
const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
function cookieOptions() {
    const isProd = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
    };
}
let AuthController = class AuthController {
    authService;
    usersService;
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async login(req, res) {
        const user = req.user;
        if (!user.enabled) {
            throw new common_1.UnauthorizedException('Tài khoản của bạn đã bị khóa, vui lòng liên hệ quản trị viên.');
        }
        const { access_token, refresh_token } = await this.authService.login({
            id: user.id,
            username: user.username,
            email: user.email,
            enabled: user.enabled,
            roles: Array.isArray(user.roles)
                ? user.roles.map((r) => (typeof r === 'string' ? r : r.name))
                : [],
        });
        res.cookie(ACCESS_TOKEN_COOKIE, access_token, {
            ...cookieOptions(),
            maxAge: 1000 * 60 * 15,
        });
        res.cookie(REFRESH_TOKEN_COOKIE, refresh_token, {
            ...cookieOptions(),
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        return {
            message: 'Login success',
            access_token,
            refresh_token,
        };
    }
    async refreshToken(req, res) {
        const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
        if (!refreshToken)
            throw new common_1.BadRequestException('Refresh token missing');
        const user = await this.authService.verifyRefreshToken(refreshToken);
        if (!user)
            throw new common_1.BadRequestException('Invalid refresh token');
        const { access_token, refresh_token: newRefresh } = await this.authService.login({
            id: user.id,
            username: user.name ?? '',
            email: user.email ?? '',
            enabled: (user.enabled) ?? true,
            roles: Array.isArray(user.roles)
                ? user.roles.map((r) => (typeof r === 'string' ? r : r.name))
                : [],
        });
        res.cookie(ACCESS_TOKEN_COOKIE, access_token, {
            ...cookieOptions(),
            maxAge: 1000 * 60 * 15,
        });
        res.cookie(REFRESH_TOKEN_COOKIE, newRefresh, {
            ...cookieOptions(),
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        return { message: 'Token refreshed' };
    }
    getProfile(req) {
        const u = req.user;
        return {
            id: u.id,
            username: u.name,
            email: u.email,
            enabled: u.enabled,
            roles: u.roles ?? [],
            avatar: u.avatar,
        };
    }
    async logout(req, res) {
        const user = req.user;
        if (user?.id) {
            const svc = this.authService;
            await svc.revokeRefreshToken?.(user.id);
        }
        res.clearCookie(ACCESS_TOKEN_COOKIE, cookieOptions());
        res.clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions());
        return { message: 'Logged out' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map