import { UsersService } from './users.service';
import { User } from '../../entity/User';
import { UpdateUserDto } from './dto/UpdateDto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getCountUsers(): Promise<number>;
    createUser(userData: Partial<User>): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getInfoUserById(id: number): Promise<User | null>;
    updatePassword(id: number, { oldPassword, newPassword }: {
        oldPassword: string;
        newPassword: string;
    }): Promise<User | {
        message: string;
    }>;
    updateUser1(id: number, userData: UpdateUserDto): Promise<User | {
        message: string;
    }>;
    deleteUser(id: number): Promise<User | {
        message: string;
    }>;
}
