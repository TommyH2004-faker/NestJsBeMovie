// import {
//   BadRequestException,
//   Body,
//   Controller,
//   Get,
//   NotFoundException,
//   Param,
//   Post,
//   Put,
//   Query,
//   Req,
//   Res,
//   UseGuards,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { UsersService } from '../users/users.service';
// import { Request, Response } from 'express';
// import { LocalAuthGuard } from '../../guards/local-auth.guard';
// import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

// @Controller('auth')
// export class AuthController {
//   constructor(
//     // eslint-disable-next-line prettier/prettier
//     private readonly authService: AuthService,
//     private userservice: UsersService,
//   ) {}

//   @Post('register')
//   register(@Body() userData: any) {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//     return this.userservice.create(userData);
//   }

//   // @Post('/login')
//   // async login(@Body() dataLogin: { email: string; password: string }) {
//   //   const { email, password } = dataLogin;
//   //
//   //   const user = await this.userservice.validateUser(email, password);
//   //   if (!user) {
//   //     throw new HttpException(
//   //       'Email hoặc mật khẩu không đúng',
//   //       HttpStatus.UNAUTHORIZED,
//   //     );
//   //   }
//   //   return {
//   //     message: 'Đăng nhập thành công',
//   //     user,
//   //   };
//   // }

//   // @UseGuards(LocalAuthGuard)
//   // @Post('login')
//   // login(@Req() req: Request) {
//   //   // return req.user;
//   //   return this.authService.login(
//   //     req.user as unknown as { username: string; id: number; email: string; roles: string[] },
//   //   );
//   // }
// @Post('login')
// @UseGuards(LocalAuthGuard)
// login(@Req() req: Request) {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const user = req.user as any;
//   return this.authService.login({
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     id: user.id,
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     username: user.username,
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     email: user.email,
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     enabled: user.enabled,
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     roles: Array.isArray(user.roles) ? [user.roles[0]] : [user.roles],
//   });
// }

//   @Post('/refresh-token')
//   async refreshToken(@Body() { refresh_token }: { refresh_token: string }) {
//     if (!refresh_token) {
//       throw new BadRequestException('Refresh token is required');
//     }
//     const user = await this.authService.verityRefreshToken(refresh_token);
//     if (!user) {
//       throw new BadRequestException('Invalid refresh token');
//     }
//     return this.authService.login({
//   id: user.id,
//   username: user.name,
//   email: user.email,
//   enabled: user.enabled,
//   roles: user.roles ? user.roles.map(role => role.name) : [], //  Chuyển đổi roles sang mảng tên role
// });
//   }

//   // @UseGuards(JwtAuthGuard)
//   // @Get('/profile')
//   // profile(@Req() req: Request) {
//   //   return {
//   //     user: req.user?.id,
//   //     username: req.user?.username,
//   //     email: req.user?.email,
//   //     roles: req.user?.roles,
//   //     message: 'Profile retrieved successfully',
//   //   };
//   //   // return req.user;
//   // }

//   // // Trong AuthController

//   @UseGuards(JwtAuthGuard)
// @Get('/profile')
// getProfile(@Req() req: Request) {
//   return {
//     id: req.user?.id,
//     username: req.user?.username,
//     email: req.user?.email,
//     role: Array.isArray(req.user?.roles) ? req.user?.roles[0] : req.user?.roles, // ✅ Trả về tên role duy nhất
//   };
// }
// // @UseGuards(JwtAuthGuard)
// // @Get('/profile')
// // getProfile(@Req() req: Request) {
// //   return {
// //     id: req.user?.id,
// //     username: req.user?.username,
// //     email: req.user?.email,
// //     roles: req.user?.roles,
// //     message: 'Profile retrieved successfully', //  Trả về mảng roles
// //   };
// // }
//   @Get('search/existsByEmail')
//   async existsByEmails(@Query('email') email: string): Promise<string> {
     
//     const exists = await this.userservice.existsByEmail(email);
//     return exists ? 'true' : 'false';
//   }

//   // Endpoint kiểm tra username đã tồn tại chưa
// @Get('search/existsByUsername')
// async existsByUsername(@Query('name') name: string): Promise<string> {
//   const exists = await this.userservice.existsByName(name);
//   return exists ? 'true' : 'false';
// }



// //  @Get('/activate/:code')
// //   async activate(@Param('code') code: string, @Res() res: Response) {
     
// //     const user = await this.userservice.activateAccount(code);

// //     if (!user) {
       
// //       return res.status(400).send(' Mã kích hoạt không hợp lệ hoặc đã hết hạn.');
// //     }

     
// //     return res.send(' Kích hoạt tài khoản thành công! Giờ bạn có thể đăng nhập.');
// //   }
// @Get('/activate/:code')
// async activate(@Param('code') code: string, @Res() res: Response) {
//   const user = await this.userservice.activateAccount(code);

//   if (!user) {
//     return res.status(400).json({
//       success: false,
//       message: ' Mã kích hoạt không hợp lệ hoặc đã hết hạn.'
//     });
//   }

//   return res.status(200).json({
//     success: true,
//     message: ' Kích hoạt tài khoản thành công! Giờ bạn có thể đăng nhập.'
//   });
// }

//  @Put('forgot-password')
//   async forgotPassword(@Body('email') email: string) {
     
//     const ok = await this.userservice.forgotPassword(email);
//     if (!ok) throw new NotFoundException('Email không tồn tại');
//     return { success: true, message: 'Mật khẩu mới đã được gửi vào email của bạn' };
//   }
// }


import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

// cookie options helper
function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd, // true trên production (HTTPS)
    sameSite: 'strict' as const,
    // note: maxAge set individually
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    // eslint-disable-next-line prettier/prettier
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Login bằng LocalAuthGuard (passport-local)
   * Server trả cookies httpOnly, không trả token trong body (chỉ message)
   */
//   @UseGuards(LocalAuthGuard)
//   @Post('login')
//   async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const user = req.user as any;

//     const { access_token, refresh_token } = await this.authService.login({
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//       id: user.id,
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//       username: user.username,
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//       email: user.email,
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//       enabled: user.enabled,
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//       roles: Array.isArray(user.roles)
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
//         ? user.roles.map((r: any) => (typeof r === 'string' ? r : r.name))
//         : [],
//     });

//     // set cookies
//     res.cookie(ACCESS_TOKEN_COOKIE, access_token, {
//       ...cookieOptions(),
//       maxAge: 1000 * 60 * 15, 
//     });

//     res.cookie(REFRESH_TOKEN_COOKIE, refresh_token, {
//       ...cookieOptions(),
//       maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//     });

// return {
//   message: 'Login success',
//   access_token,
//   refresh_token,
// };

//   }
// @UseGuards(LocalAuthGuard)
// @Post('login')
// async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const user = req.user as any;

//   // Kiểm tra xem tài khoản có bị khóa không
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//   if (!user.enabled) {
//     throw new UnauthorizedException('Tài khoản của bạn đã bị khóa, vui lòng liên hệ quản trị viên.');
//   }

//     // Tiến hành tạo token nếu tài khoản không bị khóa
//   const { access_token, refresh_token } = await this.authService.login({
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     id: user.id,
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     username: user.name,  // Sửa từ username thành name
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     email: user.email,
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     enabled: user.enabled,
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     roles: Array.isArray(user.roles)
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
//       ? user.roles.map((r: any) => (typeof r === 'string' ? r : r.name))
//       : [],
//   });

//   // Set cookies
//   res.cookie(ACCESS_TOKEN_COOKIE, access_token, {
//     ...cookieOptions(),
//     maxAge: 1000 * 60 * 15, 
//   });

//   res.cookie(REFRESH_TOKEN_COOKIE, refresh_token, {
//     ...cookieOptions(),
//     maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//   });

//   return {
//     message: 'Login success',
//     access_token,
//     refresh_token,
//   };
// }
// @UseGuards(LocalAuthGuard)
// @Post('login')
// async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
//   // user đã được validate ở LocalStrategy (đã qua kiểm tra enabled + password)
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const user = req.user as any;

//   // Nếu tới được đây, nghĩa là user hợp lệ
//   const { access_token, refresh_token } = await this.authService.login({
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     id: user.id,
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     username: user.name,  // hoặc user.username nếu bạn đặt vậy trong entity
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     email: user.email,
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     enabled: user.enabled,
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     roles: Array.isArray(user.roles)
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
//       ? user.roles.map((r: any) => (typeof r === 'string' ? r : r.name))
//       : [],
//   });

//   // Set cookies
//   res.cookie(ACCESS_TOKEN_COOKIE, access_token, {
//     ...cookieOptions(),
//     maxAge: 1000 * 60 * 15, // 15 phút
//   });

//   res.cookie(REFRESH_TOKEN_COOKIE, refresh_token, {
//     ...cookieOptions(),
//     maxAge: 1000 * 60 * 60 * 24 * 7, // 7 ngày
//   });

//   return {
//     message: 'Login success',
//     access_token,
//     refresh_token,
//   };
// }
@UseGuards(LocalAuthGuard)
@Post('login')
async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const user = req.user as any;

  const { access_token, refresh_token } = await this.authService.login({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    id: user.id,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    username: user.name,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    email: user.email,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    enabled: user.enabled,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    roles: Array.isArray(user.roles)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      ? user.roles.map((r: any) => (typeof r === 'string' ? r : r.name))
      : [],
  });

  //  Thiết lập cookie option chuẩn cho môi trường deploy
  const cookieConfig = {
    httpOnly: true,
    secure: true,        // bắt buộc trên HTTPS (Render)
    sameSite: 'none' as const,    // cho phép cookie cross-site (Vercel ↔ Render)
    path: '/',
  };

  //  Set cookie Access token (15 phút)
  res.cookie(ACCESS_TOKEN_COOKIE, access_token, {
    ...cookieConfig,
    maxAge: 1000 * 60 * 15,
  });

  //  Set cookie Refresh token (7 ngày)
  res.cookie(REFRESH_TOKEN_COOKIE, refresh_token, {
    ...cookieConfig,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return {
    message: 'Login success',
  };
}


  /**
   * Refresh token endpoint.
   * - Lấy refresh token từ cookie
   * - verify bằng authService.verifyRefreshToken
   * - Nếu hợp lệ, cấp lại access_token (+ refresh token mới), ghi cookie mới
   */
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) throw new BadRequestException('Refresh token missing');

    const user = await this.authService.verifyRefreshToken(refreshToken);
    if (!user) throw new BadRequestException('Invalid refresh token');

    // tạo token mới (login sẽ hash & lưu refresh mới)
    const { access_token, refresh_token: newRefresh } =
      await this.authService.login({
        id: user.id,
        username:  user.name ?? '',
        email: user.email ?? '',
        enabled: (user.enabled) ?? true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        roles: Array.isArray(user.roles)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          ? user.roles.map((r: any) => (typeof r === 'string' ? r : r.name))
          : [],
      });

    // ghi đè cookie
    res.cookie(ACCESS_TOKEN_COOKIE, access_token, {
      ...cookieOptions(),
      maxAge: 1000 * 60 * 15, // 15 minutes
    });

    res.cookie(REFRESH_TOKEN_COOKIE, newRefresh, {
      ...cookieOptions(),
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return { message: 'Token refreshed'
    };
  }

  /**
   * Profile: JwtAuthGuard phải đọc token từ cookie (tương ứng JwtStrategy cần lấy token từ cookie)
   */
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Req() req: Request) {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   const u = req.user as any;
  //   return {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //     id: u?.id,
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //     username: u?.username,
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //     email: u?.email,
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //     roles: u?.roles ?? (u?.role ? [u.role] : []),
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //     enabled: u?.enabled,
  //   };
  // }
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Req() req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const u = req.user as any;
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    id: u.id,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    username: u.name,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    email: u.email,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    enabled: u.enabled,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    roles: u.roles ?? [],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    avatar: u.avatar,
  };
}
 @Post('register')
   register(@Body() userData: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
     return this.usersService.create(userData);
   }
   //   @Get('search/existsByEmail')
   async existsByEmails(@Query('email') email: string): Promise<string> {

     const exists = await this.usersService.existsByEmail(email);
     return exists ? 'true' : 'false';
   }

   // Endpoint kiểm tra username đã tồn tại chưa
 @Get('search/existsByUsername')
 async existsByUsername(@Query('name') name: string): Promise<string> {
   const exists = await this.usersService.existsByName(name);
   return exists ? 'true' : 'false';
 }
  /**
   * Logout: clear cookies + revoke refresh token ở DB
   */
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // strongly type the user from the request to avoid unsafe member access
    const user = req.user as { id?: number } | undefined;

    // only call revokeRefreshToken if both user.id exists and the service exposes that method
    if (user?.id) {
      const svc = this.authService as unknown as {
        revokeRefreshToken?: (id: number) => Promise<void>;
      };
      await svc.revokeRefreshToken?.(user.id);
    }

    res.clearCookie(ACCESS_TOKEN_COOKIE, cookieOptions());
    res.clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions());

    return { message: 'Logged out' };
  }
  @Get('/activate/:code')
async activate(@Param('code') code: string, @Res() res: Response) {
  const user = await this.usersService.activateAccount(code);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: ' Mã kích hoạt không hợp lệ hoặc đã hết hạn.'
    });
  }

  return res.status(200).json({
    success: true,
    message: ' Kích hoạt tài khoản thành công! Giờ bạn có thể đăng nhập.'
  });
}

 @Put('forgot-password')
  async forgotPassword(@Body('email') email: string) {
     
    const ok = await this.usersService.forgotPassword(email);
    if (!ok) throw new NotFoundException('Email không tồn tại');
    return { success: true, message: 'Mật khẩu mới đã được gửi vào email của bạn' };
  }
}
