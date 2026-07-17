import { Module } from '@nestjs/common';
import { CreditNotesService } from './credit-notes.service';
import { CreditNotesController } from './credit-notes.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { CounterModule } from '../../core/counter/counter.module';

@Module({
  imports: [PrismaModule, CounterModule],
  controllers: [CreditNotesController],
  providers: [CreditNotesService],
})
export class CreditNotesModule {}
