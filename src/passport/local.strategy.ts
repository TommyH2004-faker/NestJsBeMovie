import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // eslint-disable-next-line prettier/prettier
  constructor(private userService: UsersService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.userService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
