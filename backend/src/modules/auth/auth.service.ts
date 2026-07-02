import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_default_key');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Identifiants invalides ou compte inactif');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      roleId: user.roleId,
    };

    // Mettre à jour lastLogin en tâche de fond (sans await pour ne pas ralentir le login)
    this.usersService.updateLastLogin(user.id).catch(console.error);

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: (user as any).role?.name || 'MANAGER'
      }
    };
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
