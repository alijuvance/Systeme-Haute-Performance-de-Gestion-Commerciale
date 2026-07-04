import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email }, include: { role: true } });
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    // Hash asynchrone pour ne pas bloquer l'event loop (très performant)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    try {
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
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Un utilisateur avec cette adresse email existe déjà.');
      }
      throw error;
    }
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

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        depot: true,
      },
    });
    if (!user) return null;
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Vérifier que l'utilisateur existe
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    // Construire explicitement l'objet de mise à jour
    const data: Record<string, any> = {};

    if (updateUserDto.fullName !== undefined) data.fullName = updateUserDto.fullName;
    if (updateUserDto.email !== undefined) data.email = updateUserDto.email;
    if (updateUserDto.roleId !== undefined) data.roleId = updateUserDto.roleId;
    if (updateUserDto.avatar !== undefined) data.avatar = updateUserDto.avatar;
    if (updateUserDto.isActive !== undefined) data.isActive = updateUserDto.isActive;

    // Gestion spéciale de depotId (nullable en base)
    if (updateUserDto.depotId !== undefined) {
      data.depotId = updateUserDto.depotId || null;
    }

    // Gestion du mot de passe (hash uniquement si fourni)
    if (updateUserDto.password) {
      data.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
        include: { role: true, depot: true },
      });
      const { passwordHash: _, ...result } = user;
      return result;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Un utilisateur avec cette adresse email existe déjà.');
      }
      throw error;
    }
  }

  async toggleStatus(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });
    const { passwordHash: _, ...result } = updatedUser;
    return result;
  }

  async updateLastLogin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() }
    });
  }

  async updateOtp(userId: string, otp: string | null, expiresAt: Date | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { resetOtp: otp, resetOtpExpiresAt: expiresAt },
    });
  }

  async updatePasswordAndClearOtp(userId: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        resetOtp: null,
        resetOtpExpiresAt: null,
      },
    });
  }
}
