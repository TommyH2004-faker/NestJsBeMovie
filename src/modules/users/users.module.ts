import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/User';
import { Role } from '../../entity/role.entity';
import { MailerModule } from '../../shared/mailer.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User, Role]), MailerModule], // Specify the User and Role entities here
})
export class UsersModule {}
