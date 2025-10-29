// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Injectable } from '@nestjs/common';
// import { UsersService } from '../modules/users/users.service';
// import { JwtPayload } from './JwtPayload';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   // eslint-disable-next-line prettier/prettier
//  constructor(private readonly usersService: UsersService) {
//     const jwtSecret = process.env.JWT_SECRET;
//     if (!jwtSecret) {
//       throw new Error('JWT_SECRET environment variable is not set');
//     }
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: jwtSecret,
//     });
//   }

//   async validate(payload: JwtPayload) {
//     const email = payload.email;
//     const user = await this.usersService.findByEmail(email);
//     return user;
//   }
// }
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { JwtPayload } from './JwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly usersService: UsersService) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET environment variable is not set');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (req?.cookies?.access_token) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
            return req.cookies.access_token;
          }
          return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) throw new UnauthorizedException('User not found');

    return {
      id: user.id,
      username: user.name,
      email: user.email,
      enabled: user.enabled,
      roles: Array.isArray(user.roles)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        ? user.roles.map((r: any) => (typeof r === 'string' ? r : r.name))
        : [],
    };
  }
}
