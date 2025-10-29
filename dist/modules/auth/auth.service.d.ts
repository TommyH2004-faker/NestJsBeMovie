import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entity/User';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    login(user: {
        id: number;
        username: string;
        email: string;
        roles: string[];
        enabled: boolean;
    }): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    verifyRefreshToken(refresh_token: string): Promise<User | null>;
}
