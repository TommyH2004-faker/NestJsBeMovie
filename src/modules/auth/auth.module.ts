import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../passport/local.strategy';
import { JwtStrategy } from '../../passport/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret:
        '2d4f5e61a8cd431fd64fbdc29074d969b05e924ee3d6673e1058c33a3a2220f2',
      signOptions: { expiresIn: '1h' }, // Thời gian hết hạn của JWT
    }),
  ],
})
export class AuthModule {
  constructor() {
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug log to check JWT_SECRET
  }
}
