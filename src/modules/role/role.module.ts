import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../entity/role.entity';
@Module({
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
  imports: [TypeOrmModule.forFeature([Role])], // Specify the Role entity here if it exists
})
export class RoleModule {}
