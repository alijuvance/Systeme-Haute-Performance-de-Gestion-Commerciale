import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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
            role: any;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<Omit<{
        email: string;
        fullName: string;
        roleId: string;
        avatar: string | null;
        depotId: string | null;
        isActive: boolean;
        id: string;
        passwordHash: string;
        resetOtp: string | null;
        resetOtpExpiresAt: Date | null;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, "passwordHash">>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
}
