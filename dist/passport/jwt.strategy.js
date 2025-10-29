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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../modules/users/users.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    usersService;
    constructor(usersService) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret)
            throw new Error('JWT_SECRET environment variable is not set');
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (req) => {
                    if (req?.cookies?.access_token) {
                        return req.cookies.access_token;
                    }
                    return passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
        this.usersService = usersService;
    }
    async validate(payload) {
        const user = await this.usersService.findByEmail(payload.email);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return {
            id: user.id,
            username: user.name,
            email: user.email,
            enabled: user.enabled,
            roles: Array.isArray(user.roles)
                ? user.roles.map((r) => (typeof r === 'string' ? r : r.name))
                : [],
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map