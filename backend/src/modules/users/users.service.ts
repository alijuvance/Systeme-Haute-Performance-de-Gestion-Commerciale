import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
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

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash,
        fullName: createUserDto.fullName,
        roleId: createUserDto.roleId,
      },
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }
}
