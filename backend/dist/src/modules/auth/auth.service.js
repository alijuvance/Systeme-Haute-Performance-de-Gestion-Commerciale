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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_default_key');
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Identifiants invalides ou compte inactif');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Identifiants invalides');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            roleId: user.roleId,
        };
        this.usersService.updateLastLogin(user.id).catch(console.error);
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role?.name || 'MANAGER'
            }
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.usersService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            return { message: 'Si un compte existe avec cet e-mail, un code a été envoyé.' };
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        await this.usersService.updateOtp(user.id, otp, expiresAt);
        try {
            if (process.env.RESEND_API_KEY) {
                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: user.email,
                    subject: 'Réinitialisation de votre mot de passe',
                    html: `<p>Votre code de réinitialisation est : <strong>${otp}</strong></p><p>Ce code expire dans 15 minutes.</p>`,
                });
            }
            else {
                console.log(`[DEV MODE] OTP pour ${user.email} : ${otp}`);
            }
        }
        catch (error) {
            console.error("Erreur lors de l'envoi de l'email via Resend:", error);
        }
        return { message: 'Si un compte existe avec cet e-mail, un code a été envoyé.' };
    }
    async resetPassword(resetPasswordDto) {
        const user = await this.usersService.findByEmail(resetPasswordDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Code invalide ou expiré');
        }
        if (user.resetOtp !== resetPasswordDto.otp || !user.resetOtpExpiresAt) {
            throw new common_1.UnauthorizedException('Code invalide ou expiré');
        }
        if (new Date() > user.resetOtpExpiresAt) {
            throw new common_1.UnauthorizedException('Code expiré');
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, saltRounds);
        await this.usersService.updatePasswordAndClearOtp(user.id, passwordHash);
        return { message: 'Mot de passe mis à jour avec succès' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map