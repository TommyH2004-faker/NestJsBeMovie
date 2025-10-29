import { Strategy } from 'passport-jwt';
import { UsersService } from '../modules/users/users.service';
import { JwtPayload } from './JwtPayload';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate(payload: JwtPayload): Promise<{
        id: number;
        username: string;
        email: string;
        enabled: boolean;
        roles: any[];
    }>;
}
export {};
