import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePaymentDto) {
    return this.prisma.$transaction(async (prisma) => {
      const invoice = await prisma.invoice.findUnique({
        where: { id: data.invoiceId }
      });

      if (!invoice) {
        throw new NotFoundException('Facture non trouvée');
      }

      if (invoice.status === 'CANCELLED') {
        throw new BadRequestException('Impossible de payer une facture annulée');
      }

      const newAmountPaid = invoice.amountPaid + data.amount;
      const epsilon = 0.01;

      if (newAmountPaid > invoice.totalAmount + epsilon) {
        throw new BadRequestException('Le montant payé ne peut pas dépasser le total de la facture');
      }

      const payment = await prisma.payment.create({
        data: {
          amount: data.amount,
          method: data.method,
          reference: data.reference,
          note: data.note,
          invoiceId: data.invoiceId
        }
      });

      let status = invoice.status;
      if (Math.abs(newAmountPaid - invoice.totalAmount) < epsilon) {
        status = 'PAID';
      } else if (newAmountPaid > 0) {
        status = 'PARTIAL';
      }

      await prisma.invoice.update({
        where: { id: data.invoiceId },
        data: {
          amountPaid: newAmountPaid,
          status: status
        }
      });

      return payment;
    });
  }

  async findByInvoice(invoiceId: string) {
    return this.prisma.payment.findMany({
      where: { invoiceId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
