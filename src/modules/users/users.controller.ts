import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../entity/User';
import { UpdateUserDto } from './dto/UpdateDto';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../Cloundinary/cloudinary-storage';

@Controller('users')
export class UsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly usersService: UsersService) {
  }

  @Get('count')
  async getCountUsers() {
    return await this.usersService.getCountUsers();
  }

  @Post()
  async createUser(@Body() userData: Partial<User>) {
    return await this.usersService.create(userData);
  }

  @Get('/user')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  // @Get(':id')
  // async getInfoUserById(@Param('id') id: number) {
  //   return await this.usersService.getInfoUserById(id);
  // }

  // @Put(":id")
  // async updateUser(
  //   @Param("id") id: number,
  //   @Body() userData: Partial<User>,
  // ) {
  //   const updatedUser = await this.usersService.updateInfoUser(id, userData);
  //   if (!updatedUser) {
  //     return { message: "User not found" };
  //   }
  //   return updatedUser;
  // }
  // @Put(':id/password')
  // async updatePassword(
  //   @Param('id') id: number,
  //   @Body() { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
  // ) {
  //   const isMatch = await this.usersService.ConfirmPassword(id, oldPassword);
  //   if (!isMatch) {
  //     return { message: 'Old password is incorrect' };
  //   }
  //   const updatedUser = await this.usersService.updateInfoUser(id, { password: newPassword });
  //   if (!updatedUser) {
  //     return { message: 'User not found' };
  //   }
  //   return updatedUser;
  // }

@Put(':id/password')
async updatePassword(
  @Param('id') id: number,
  @Body() { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
) {
  const isMatch = await this.usersService.ConfirmPassword(id, oldPassword);
  if (!isMatch) {
    return { message: 'Old password is incorrect' };
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const hashed = await bcrypt.hash(newPassword, 10);


  const updatedUser = await this.usersService.updateInfoUser(id, { password: hashed });
  if (!updatedUser) {
    return { message: 'User not found' };
  }

  return { message: 'Password updated successfully' };
}
@Get(':id')
async getUserById(@Param('id') id: number) {
  return this.usersService.findOneWithReviews(id); // ✅ gọi hàm có relations
}

  @Put(":id")
  async updateUser1(@Param("id") id: number, @Body() userData: UpdateUserDto) {
    const updatedUser = await this.usersService.updateInfoUser(id, userData);
    if (!updatedUser) {
      return { message: "User not found" };
    }
    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const user = await this.usersService.deleteUser(id);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }

 @Put(':id/avatar')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Không nhận được file');

    // 🔹 Với CloudinaryStorage, file.path chính là URL public (secure_url)
    const avatarUrl = file.path;

    // 🔹 Cập nhật DB với link công khai
    const updatedUser = await this.usersService.update(id, {
      avatar: avatarUrl,
    });

    if (!updatedUser) throw new BadRequestException('Không tìm thấy người dùng');

    return {
      avatar: updatedUser.avatar,
      message: 'Cập nhật ảnh đại diện thành công',
    };
  }





  
}