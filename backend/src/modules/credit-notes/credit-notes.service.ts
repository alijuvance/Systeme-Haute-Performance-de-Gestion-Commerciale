import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCreditNoteDto } from './dto/create-credit-note.dto';
import { CounterService } from '../../core/counter/counter.service';

@Injectable()
export class CreditNotesService {
  constructor(
    private prisma: PrismaService,
    private counterService: CounterService
  ) {}

  async create(data: CreateCreditNoteDto) {
    return this.prisma.$transaction(async (prisma) => {
      const invoice = await prisma.invoice.findUnique({
        where: { id: data.invoiceId },
        include: { lines: true }
      });

      if (!invoice) {
        throw new NotFoundException('Facture non trouvée');
      }

      // Calcul du total de l'avoir
      let totalAmount = 0;
      for (const line of data.lines) {
        totalAmount += line.quantity * line.unitPrice;
      }

      const creditNoteNumber = await this.counterService.getNextNumber('CREDIT_NOTE');

      const creditNote = await prisma.creditNote.create({
        data: {
          creditNoteNumber,
          invoiceId: data.invoiceId,
          reason: data.reason,
          totalAmount,
          lines: {
            create: data.lines.map(l => ({
              productId: l.productId,
              quantity: l.quantity,
              unitPrice: l.unitPrice
            }))
          }
        },
        include: { lines: true }
      });

      return creditNote;
    });
  }

  async findAll() {
    return this.prisma.creditNote.findMany({
      include: {
        invoice: {
          include: { customer: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByInvoice(invoiceId: string) {
    return this.prisma.creditNote.findMany({
      where: { invoiceId },
      include: { lines: true }
    });
  }
}
