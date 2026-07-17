import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { Resend } from 'resend';
import { PrismaService } from '../../core/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

const resend = new Resend(process.env.RESEND_API_KEY || 're_default_key');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Génère une paire access_token (15min) + refresh_token (7 jours).
   */
  private async generateTokens(userId: string, email: string, roleId: string) {
    const payload = { sub: userId, email, roleId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync({ sub: userId, jti: uuidv4() }, { expiresIn: '7d' }),
    ]);

    // Stocker le hash du refresh token en base
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const refreshTokenExp = new Date();
    refreshTokenExp.setDate(refreshTokenExp.getDate() + 7);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: refreshTokenHash, refreshTokenExp },
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Identifiants invalides ou compte inactif');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Mettre à jour lastLogin en tâche de fond (sans await pour ne pas ralentir le login)
    this.usersService.updateLastLogin(user.id).catch(console.error);

    const tokens = await this.generateTokens(user.id, user.email, user.roleId);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: (user as any).role?.name || 'MANAGER'
      }
    };
  }

  /**
   * Renouvelle les tokens via un refresh token valide (rotation).
   */
  async refreshTokens(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });

      if (!user || !user.refreshToken || !user.refreshTokenExp) {
        throw new ForbiddenException('Refresh token invalide');
      }

      // Vérifier l'expiration
      if (new Date() > user.refreshTokenExp) {
        throw new ForbiddenException('Refresh token expiré');
      }

      // Vérifier le hash
      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) {
        // Possible vol de token — invalider tous les refresh tokens
        await this.prisma.user.update({
          where: { id: user.id },
          data: { refreshToken: null, refreshTokenExp: null },
        });
        throw new ForbiddenException('Refresh token invalide — session invalidée');
      }

      // Rotation : générer une nouvelle paire de tokens
      return this.generateTokens(user.id, user.email, user.roleId);
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new ForbiddenException('Refresh token invalide');
    }
  }

  /**
   * Invalide le refresh token (logout).
   */
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null, refreshTokenExp: null },
    });
    return { message: 'Déconnexion réussie' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      // Pour des raisons de sécurité, on ne dit pas si l'email existe ou non
      return { message: 'Si un compte existe avec cet e-mail, un code a été envoyé.' };
    }

    // Générer un OTP à 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Valide 15 minutes

    await this.usersService.updateOtp(user.id, otp, expiresAt);

    // Envoi de l'e-mail via Resend
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: user.email,
          subject: 'Réinitialisation de votre mot de passe',
          html: `<p>Votre code de réinitialisation est : <strong>${otp}</strong></p><p>Ce code expire dans 15 minutes.</p>`,
        });
      } else {
        console.log(`[DEV MODE] OTP pour ${user.email} : ${otp}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email via Resend:", error);
    }

    return { message: 'Si un compte existe avec cet e-mail, un code a été envoyé.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);
    if (!user) {
      throw new UnauthorizedException('Code invalide ou expiré');
    }

    // Vérifier l'OTP
    if (user.resetOtp !== resetPasswordDto.otp || !user.resetOtpExpiresAt) {
      throw new UnauthorizedException('Code invalide ou expiré');
    }

    if (new Date() > user.resetOtpExpiresAt) {
      throw new UnauthorizedException('Code expiré');
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, saltRounds);

    // Mettre à jour en base et effacer l'OTP
    await this.usersService.updatePasswordAndClearOtp(user.id, passwordHash);

    return { message: 'Mot de passe mis à jour avec succès' };
  }
}
