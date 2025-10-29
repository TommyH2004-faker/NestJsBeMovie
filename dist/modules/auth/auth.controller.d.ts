import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(req: Request, res: Response): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
    }>;
    refreshToken(req: Request, res: Response): Promise<{
        message: string;
    }>;
    getProfile(req: Request): {
        id: any;
        username: any;
        email: any;
        enabled: any;
        roles: any;
        avatar: any;
    };
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
}
