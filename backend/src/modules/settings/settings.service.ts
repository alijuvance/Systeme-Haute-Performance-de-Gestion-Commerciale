import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.systemSettings.findFirst();
    
    // If no settings exist yet, create default settings
    if (!settings) {
      settings = await this.prisma.systemSettings.create({
        data: {
          companyName: 'Mon Entreprise',
          defaultCurrency: 'MGA',
          defaultVatRate: 20.0,
        },
      });
    }
    
    return settings;
  }

  async updateSettings(data: {
    companyName?: string;
    taxId?: string;
    address?: string;
    phone?: string;
    email?: string;
    defaultCurrency?: string;
    defaultVatRate?: number;
  }) {
    const currentSettings = await this.getSettings();
    
    return this.prisma.systemSettings.update({
      where: { id: currentSettings.id },
      data,
    });
  }
}
