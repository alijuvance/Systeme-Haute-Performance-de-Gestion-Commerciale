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
    findAll(): Promise<{
        role: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            permissions: string | null;
        };
        depot: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        } | null;
        email: string;
        fullName: string;
        roleId: string;
        avatar: string | null;
        depotId: string | null;
        isActive: boolean;
        id: string;
        resetOtp: string | null;
        resetOtpExpiresAt: Date | null;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        role: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            permissions: string | null;
        };
        depot: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        } | null;
        email: string;
        fullName: string;
        roleId: string;
        avatar: string | null;
        depotId: string | null;
        isActive: boolean;
        id: string;
        resetOtp: string | null;
        resetOtpExpiresAt: Date | null;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        fullName: string;
        roleId: string;
        avatar: string | null;
        depotId: string | null;
        isActive: boolean;
        id: string;
        resetOtp: string | null;
        resetOtpExpiresAt: Date | null;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleStatus(id: string): Promise<{
        email: string;
        fullName: string;
        roleId: string;
        avatar: string | null;
        depotId: string | null;
        isActive: boolean;
        id: string;
        resetOtp: string | null;
        resetOtpExpiresAt: Date | null;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
