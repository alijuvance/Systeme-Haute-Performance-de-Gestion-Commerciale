import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { CreditNotesService } from './credit-notes.service';
import { CreateCreditNoteDto } from './dto/create-credit-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('credit-notes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreditNotesController {
  constructor(private readonly creditNotesService: CreditNotesService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  create(@Body() createCreditNoteDto: CreateCreditNoteDto) {
    return this.creditNotesService.create(createCreditNoteDto);
  }

  @Get()
  findAll() {
    return this.creditNotesService.findAll();
  }

  @Get('by-invoice')
  findByInvoice(@Query('invoiceId') invoiceId: string) {
    if (!invoiceId) return [];
    return this.creditNotesService.findByInvoice(invoiceId);
  }
}
