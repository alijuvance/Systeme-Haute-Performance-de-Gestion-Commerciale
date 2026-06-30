import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

export interface AppNotification {
  id: string;
  type: 'WARNING' | 'ERROR' | 'INFO';
  title: string;
  message: string;
  link: string;
  date: Date;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(): Promise<AppNotification[]> {
    const notifications: AppNotification[] = [];

    // 1. Alertes de stock bas
    const lowStocks = await this.prisma.stockLevel.findMany({
      where: {
        minAlertQuantity: { gt: 0 },
        // On ne peut pas directement comparer deux champs dans la clause where standard,
        // donc on va filtrer en mémoire ou utiliser un count si on veut être efficace, 
        // mais vu le volume on va récupérer ceux avec alert > 0 et filtrer
      },
      include: {
        product: true,
        depot: true,
      },
    });

    const actuallyLowStocks = lowStocks.filter(sl => sl.quantity <= sl.minAlertQuantity);

    actuallyLowStocks.forEach(sl => {
      notifications.push({
        id: `low-stock-${sl.id}`,
        type: 'WARNING',
        title: 'Stock bas',
        message: `Le produit "${sl.product.name}" a atteint son seuil d'alerte (${sl.quantity} restant) dans le dépôt "${sl.depot.name}".`,
        link: '/dashboard/stocks',
        date: sl.updatedAt,
      });
    });

    // 2. Alertes de factures impayées (B2B ou POS)
    // Factures dont le statut est PENDING ou PARTIAL, et datant de plus de 30 jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const unpaidInvoices = await this.prisma.invoice.findMany({
      where: {
        status: { in: ['PENDING', 'PARTIAL'] },
        date: { lt: thirtyDaysAgo },
      },
      include: {
        customer: true,
      },
    });

    unpaidInvoices.forEach(inv => {
      const remainingAmount = inv.totalAmount - inv.amountPaid;
      const customerName = inv.customer.companyName || inv.customer.fullName || 'Client inconnu';
      
      notifications.push({
        id: `unpaid-${inv.id}`,
        type: 'ERROR',
        title: 'Facture en souffrance',
        message: `La facture ${inv.invoiceNumber} de ${customerName} (Reste: ${remainingAmount.toLocaleString('fr-FR')} Ar) est impayée depuis plus de 30 jours.`,
        link: '/dashboard/sales',
        date: inv.date,
      });
    });

    // Trier les notifications par date (les plus récentes en premier, ou selon la priorité)
    // Ici, on va les trier par date décroissante pour que l'utilisateur voie les alertes les plus "urgentes" ou récentes
    return notifications.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
