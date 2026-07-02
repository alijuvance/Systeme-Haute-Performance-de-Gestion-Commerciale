import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    uploadAvatar(file: any): Promise<{
        url: string;
    }>;
    create(createUserDto: CreateUserDto): Promise<Omit<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        fullName: string;
        isActive: boolean;
        resetOtp: string | null;
        resetOtpExpiresAt: Date | null;
        roleId: string;
        avatar: string | null;
        lastLogin: Date | null;
        depotId: string | null;
    }, "passwordHash">>;
    findAll(): Promise<{
        role: {
            id: string;
            name: string;
            permissions: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        depot: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullName: string;
        isActive: boolean;
        resetOtp: string | null;
        resetOtpExpiresAt: Date | null;
        roleId: string;
        avatar: string | null;
        lastLogin: Date | null;
        depotId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        role: {
            id: string;
            name: string;
            permissions: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        depot: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullName: string;
        isActive: boolean;
        resetOtp: string | null;
        resetOtpExpiresAt: Date | null;
        roleId: string;
        avatar: string | null;
        lastLogin: Date | null;
        depotId: string | null;
    } | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullName: string;
        isActive: boolean;
        resetOtp: string | null;
        resetOtpExpiresAt: Date | null;
        roleId: string;
        avatar: string | null;
        lastLogin: Date | null;
        depotId: string | null;
    }>;
    toggleStatus(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        fullName: string;
        isActive: boolean;
        resetOtp: string | null;
        resetOtpExpiresAt: Date | null;
        roleId: string;
        avatar: string | null;
        lastLogin: Date | null;
        depotId: string | null;
    }>;
}
