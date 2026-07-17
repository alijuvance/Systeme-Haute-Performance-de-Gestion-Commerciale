import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CounterService {
  constructor(private prisma: PrismaService) {}

  /**
   * Génère le prochain numéro séquentiel de manière atomique.
   * Utilise une transaction Prisma pour éviter les collisions.
   * @param type - Type de compteur (ex: 'INVOICE', 'PURCHASE_ORDER')
   * @returns Numéro formaté (ex: 'INV-2026-0001')
   */
  async getNextNumber(type: string): Promise<string> {
    return this.prisma.$transaction(async (tx) => {
      // Incrémenter atomiquement le compteur
      const prefixMap: Record<string, string> = {
        'INVOICE': 'INV',
        'PURCHASE_ORDER': 'PO',
        'CREDIT_NOTE': 'CN',
      };
      
      const counter = await tx.counter.upsert({
        where: { id: type },
        update: { lastValue: { increment: 1 } },
        create: {
          id: type,
          prefix: prefixMap[type] || type.substring(0, 3).toUpperCase(),
          lastValue: 1,
        },
      });

      const year = new Date().getFullYear();
      const paddedValue = counter.lastValue.toString().padStart(5, '0');
      return `${counter.prefix}-${year}-${paddedValue}`;
    });
  }
}
