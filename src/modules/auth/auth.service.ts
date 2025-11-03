// import { Injectable } from '@nestjs/common';

// import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';
// import { User } from '../../entity/User';

// @Injectable()
// export class AuthService {
//   constructor(
//     // eslint-disable-next-line prettier/prettier
//     private readonly userService: UsersService,
//     private readonly jwtservice: JwtService,
//   ) {
//   }

//   // login(user: { id: number; username: string; email: string  , roles: string[] }) {
//   //   const payload = {
//   //     sub: user.id,
//   //     username: user.username,
//   //     email: user.email,
//   //     roles: user.roles,
//   //   };
//   //   const access_token = this.jwtservice.sign(payload);
//   //   const refresh_token = this.jwtservice.sign(payload, {
//   //     expiresIn: '7d',
//   //   });
//   //   void this.userService.saveRefreshToken(refresh_token, user.id);
//   //   return {
//   //     access_token,
//   //     refresh_token,
//   //   };
//   // }
// login(user: { id: number; username: string; email: string; roles: string[]; enabled: boolean }) {
//   const payload = {
//     sub: user.id,
//     username: user.username,
//     email: user.email,
     
//     enabled: user.enabled,
//     role: Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0] : '', //  Chỉ lấy tên role đầu tiên
//   };
//   const access_token = this.jwtservice.sign(payload);
//   const refresh_token = this.jwtservice.sign(payload, {
//     expiresIn: '7d',
//   });
//   void this.userService.saveRefreshToken(refresh_token, user.id);
//   return {
//     access_token,
//     refresh_token,
//   };
// }
//   verityRefreshToken(refresh_token: string): Promise<User> {
//     return this.jwtservice.decode(refresh_token);
//   }
  
// }
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entity/User';

@Injectable()
export class AuthService {
  constructor(
    // eslint-disable-next-line prettier/prettier
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  //  Tạo token & lưu refresh token mã hoá
  async login(user: {
    id: number;
    username: string;
    email: string;
    roles: string[];
    enabled: boolean;
  }) {
  const payload = {
    sub: user.id,
    email: user.email,
    username: user.username,
    enabled: user.enabled,
    roles: user.roles, //  thêm roles vào payload
  };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    //  Lưu refresh token đã mã hoá để kiểm tra khi user refresh
    const hashedRefresh = await bcrypt.hash(refresh_token, 10);
    await this.userService.saveRefreshToken(hashedRefresh, user.id);

    return { access_token, refresh_token };
  }

  async verifyRefreshToken(refresh_token: string): Promise<User | null> {
    try {
      // Type the JWT payload to avoid `any`
      const decoded = this.jwtService.verify<{ sub: number }>(refresh_token);

      // Ensure decoded is an object with a numeric `sub`
      const userId =
        typeof decoded === 'object' && decoded !== null && 'sub' in decoded
          ? (decoded as { sub: number }).sub
          : null;
      if (typeof userId !== 'number') return null;

      // UsersService may not expose `findById` in its type: assert a shape that includes it
      const user = await (this.userService as unknown as {
        findById(id: number): Promise<User | null>;
      }).findById(userId);

      if (!user) return null;
      if (typeof user.refreshToken !== 'string') return null;

      const isValid = await bcrypt.compare(refresh_token, user.refreshToken);
      if (!isValid) return null;

      return user;
    } catch {
      return null;
    }
  }
}
