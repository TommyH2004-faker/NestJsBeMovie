import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../entity/role.entity';
import { MailerService } from '../../shared/mailer.service';
import { randomBytes } from 'crypto';
import { UpdateUserDto } from './dto/UpdateDto';
@Injectable()
export class UsersService {

  constructor(
    // eslint-disable-next-line prettier/prettier
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
  }

  // async create(userData: User): Promise<User> {
  //   const user = this.userRepository.create(userData);
  //   user.enabled = false;

  //   user.createdAt = new Date();
  //   user.updatedAt = new Date();

  //   const hasshedPassword = await bcrypt.hash(user.password, 10);
  //   user.password = hasshedPassword;

  //   return this.userRepository.save(user);
  // }


// async create(userData: Partial<User>): Promise<User> {
//   const user = this.userRepository.create(userData);
//   user.enabled = false;

//   // Tìm role mặc định
//   const role = await this.roleRepository.findOne({ where: { name: 'USER' } });
//   if (role) {
//     user.roles = [role]; // ✅ Gán trực tiếp đối tượng role
//   }

//   user.createdAt = new Date();
//   user.updatedAt = new Date();
//   user.password = await bcrypt.hash(user.password, 10);

//   return this.userRepository.save(user);
// }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    user.enabled = false;

    // Tạo mã kích hoạt
    user.activationCode = randomBytes(20).toString('hex');
    const role = await this.roleRepository.findOne({ where: { name: 'USER' } });
    if (role) {
      user.roles = [role]; // ✅ Gán trực tiếp đối tượng role
    }
    user.password = await bcrypt.hash(user.password, 10);
    user.createdAt = new Date();
    user.updatedAt = new Date();

    const savedUser = await this.userRepository.save(user);

    // Tạo link kích hoạt
    const activationLink = `http://localhost:8080/kich-hoat/${savedUser.activationCode}`;

    // Gửi mail
    await this.mailerService.sendActivationEmail(savedUser.email, activationLink);

    return savedUser;
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.userRepository.findOneBy({ email });
    return user;
  }

  // async validateUser(email: string, password: string): Promise<User | null> {
  //   const user = await this.findByEmail(email);
  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     return user;
  //   }
  //   return null;
  // }
  async validateUser(email: string, password: string): Promise<User | null> {
  const user = await this.findByEmail(email);

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  // 🚫 Kiểm tra trạng thái kích hoạt
  if (!user.enabled) {
    throw new UnauthorizedException('User not enabled');
  }


  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new UnauthorizedException('Invalid password');
  }

  return user;
}

  async saveRefreshToken(refreshToken: string, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      // hash bcrypt
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      user.refreshToken = hashedRefreshToken;
      return this.userRepository.save(user);
    }
    return null;
  }

  async verityRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user && user.refreshToken) {
      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  async existsByName(name: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { name } });
    return !!user;
  }

//   async activateAccount(code: string): Promise<User | null> {
//   const user = await this.userRepository.findOne({ where: { activationCode: code } });
//   if (!user) return null;

//   user.enabled = true;
//   return this.userRepository.save(user);
// }
  async activateAccount(code: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { activationCode: code } });
    if (!user) return null;

    // Nếu tài khoản đã kích hoạt rồi thì không cần lưu nữa
    if (user.enabled) {
      return user; // trả về user luôn
    }

    user.enabled = true;
    return this.userRepository.save(user);
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return false;

    // tạo mật khẩu random
    const newPasswordPlain = Math.random().toString(36).slice(-8);

    // hash bằng bcrypt
    const hashedPassword = await bcrypt.hash(newPasswordPlain, 10);

    // lưu vào DB
    user.password = hashedPassword;
    await this.userRepository.save(user);

    // gửi mail mật khẩu mới
    await this.mailerService.sendNewPassword(user.email, newPasswordPlain);

    return true;
  }

  getCountUsers(): Promise<number> {
    return this.userRepository.count();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getInfoUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

//  async updateInfoUser(id: number, userData: Partial<User>): Promise<User | null> {
//     const user = await this.userRepository.findOne({ where: { id } });
//     if (!user) return null;

//     // Chỉ pick field cho phép update
//     if (userData.name !== undefined) user.name = userData.name;
//     if (userData.avatar !== undefined) user.avatar = userData.avatar;

//     return this.userRepository.save(user);
//   }
  async ConfirmPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return false;

    return await bcrypt.compare(password, user.password);
  }


  async updateInfoUser(id: number, userData: UpdateUserDto) {
  const user = await this.userRepository.findOneBy({ id });
  if (!user) return null;

  await this.userRepository.update(id, userData); 
  return this.userRepository.findOneBy({ id });
}
async findOneWithReviews(id: number) {
  return this.userRepository.findOne({
    where: { id },
    relations: ['reviews'],
  });
}


  async deleteUser(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;

    await this.userRepository.delete(id);
    return user;
  }

 // Nếu dùng TypeORM
// Nếu dùng TypeORM
// async update(id: number, data: Partial<User>) {
//   await this.userRepository.update(id, data);
//   return this.userRepository.findOne({ where: { id } });
// }

async update(id: number, data: Partial<User>) {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) return null;
  Object.assign(user, data);
  return await this.userRepository.save(user); // save trực tiếp, trả về user đã update
}


}


