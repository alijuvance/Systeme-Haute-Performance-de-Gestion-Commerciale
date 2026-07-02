"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email }, include: { role: true } });
    }
    async create(createUserDto) {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);
        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                passwordHash,
                fullName: createUserDto.fullName,
                roleId: createUserDto.roleId,
                avatar: createUserDto.avatar,
                depotId: createUserDto.depotId || null,
            },
        });
        const { passwordHash: _, ...result } = user;
        return result;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            include: {
                role: true,
                depot: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return users.map(user => {
            const { passwordHash: _, ...result } = user;
            return result;
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
                depot: true,
            },
        });
        if (!user)
            return null;
        const { passwordHash: _, ...result } = user;
        return result;
    }
    async update(id, updateUserDto) {
        let passwordHash;
        if (updateUserDto.password) {
            passwordHash = await bcrypt.hash(updateUserDto.password, 10);
        }
        const data = { ...updateUserDto };
        delete data.password;
        if (passwordHash) {
            data.passwordHash = passwordHash;
        }
        if (data.depotId === '') {
            data.depotId = null;
        }
        const user = await this.prisma.user.update({
            where: { id },
            data,
        });
        const { passwordHash: _, ...result } = user;
        return result;
    }
    async toggleStatus(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new Error("User not found");
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
        });
        const { passwordHash: _, ...result } = updatedUser;
        return result;
    }
    async updateLastLogin(id) {
        return this.prisma.user.update({
            where: { id },
            data: { lastLogin: new Date() }
        });
    }
    async updateOtp(userId, otp, expiresAt) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { resetOtp: otp, resetOtpExpiresAt: expiresAt },
        });
    }
    async updatePasswordAndClearOtp(userId, passwordHash) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash,
                resetOtp: null,
                resetOtpExpiresAt: null,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map