import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER')
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  @Roles('ADMIN')
  async updateSettings(
    @Body() data: {
      companyName?: string;
      taxId?: string;
      address?: string;
      phone?: string;
      email?: string;
      defaultCurrency?: string;
      defaultVatRate?: number;
    }
  ) {
    return this.settingsService.updateSettings(data);
  }
}
