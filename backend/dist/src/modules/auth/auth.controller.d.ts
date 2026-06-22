import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: string;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<Omit<{
        id: string;
        email: string;
        passwordHash: string;
        fullName: string;
        isActive: boolean;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
    }, "passwordHash">>;
    getProfile(req: any): any;
}
