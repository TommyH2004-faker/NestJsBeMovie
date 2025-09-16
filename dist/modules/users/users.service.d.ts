import { User } from '../../entity/User';
import { Repository } from 'typeorm';
import { Role } from '../../entity/role.entity';
import { MailerService } from '../../shared/mailer.service';
import { UpdateUserDto } from './dto/UpdateDto';
export declare class UsersService {
    private readonly userRepository;
    private readonly mailerService;
    private readonly roleRepository;
    constructor(userRepository: Repository<User>, mailerService: MailerService, roleRepository: Repository<Role>);
    create(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    validateUser(email: string, password: string): Promise<User | null>;
    saveRefreshToken(refreshToken: string, userId: number): Promise<User | null>;
    verityRefreshToken(refreshToken: string, userId: number): Promise<User | null>;
    existsByEmail(email: string): Promise<boolean>;
    existsByName(name: string): Promise<boolean>;
    activateAccount(code: string): Promise<User | null>;
    forgotPassword(email: string): Promise<boolean>;
    getCountUsers(): Promise<number>;
    getAllUsers(): Promise<User[]>;
    getInfoUserById(id: number): Promise<User | null>;
    ConfirmPassword(userId: number, password: string): Promise<boolean>;
    updateInfoUser(id: number, userData: UpdateUserDto): Promise<User | null>;
    deleteUser(id: number): Promise<User | null>;
}
