import { Module, Global } from '@nestjs/common';
import { CounterService } from './counter.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [CounterService],
  exports: [CounterService],
})
export class CounterModule {}
