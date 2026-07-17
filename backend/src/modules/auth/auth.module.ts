import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PrismaModule,
    JwtModule.register({
      global: true, // Rend le service JwtService accessible partout sans import redondant
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_ERP_KEY_2026',
      signOptions: { expiresIn: '15m' }, // Access token : 15 minutes (refresh token gère le renouvellement)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
