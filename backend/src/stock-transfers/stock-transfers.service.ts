import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { DispatchTransferDto } from './dto/dispatch-transfer.dto';
import { MovementType } from '../stock-movements/dto/create-stock-movement.dto';

@Injectable()
export class StockTransfersService {
  constructor(
    private prisma: PrismaService,
    private stockMovementsService: StockMovementsService
  ) {}

  async dispatchTransfer(dto: DispatchTransferDto, userId: string) {
    // Étape 1 : Retirer le stock du dépôt source (sera bloqué si insuffisant grâce au service de mouvement)
    await this.stockMovementsService.registerMovement({
      type: MovementType.TRANSFER_OUT,
      reference: dto.reference,
      quantityChanged: -dto.quantity,
      productId: dto.productId,
      depotId: dto.fromDepotId,
    }, userId);

    // Étape 2 : Créer le transfert en statut IN_TRANSIT
    return this.prisma.stockTransfer.create({
      data: {
        reference: dto.reference,
        quantity: dto.quantity,
        productId: dto.productId,
        fromDepotId: dto.fromDepotId,
        toDepotId: dto.toDepotId,
        dispatchedById: userId,
        status: 'IN_TRANSIT',
      }
    });
  }

  async receiveTransfer(transferId: string, userId: string) {
    const transfer = await this.prisma.stockTransfer.findUnique({ where: { id: transferId } });
    
    if (!transfer) throw new NotFoundException('Transfert introuvable');
    if (transfer.status !== 'IN_TRANSIT') throw new ConflictException(`Transfert déjà traité (Statut actuel: ${transfer.status})`);

    // Étape 1 : Ajouter le stock dans le dépôt de destination
    await this.stockMovementsService.registerMovement({
      type: MovementType.TRANSFER_IN,
      reference: transfer.reference,
      quantityChanged: Math.abs(transfer.quantity),
      productId: transfer.productId,
      depotId: transfer.toDepotId,
    }, userId);

    // Étape 2 : Mettre à jour le statut du transfert
    return this.prisma.stockTransfer.update({
      where: { id: transferId },
      data: {
        status: 'COMPLETED',
        receivedById: userId,
        receivedAt: new Date(),
      }
    });
  }

  async findAll() {
    return this.prisma.stockTransfer.findMany({
      include: {
        product: true,
        fromDepot: true,
        toDepot: true,
        dispatchedBy: { select: { fullName: true } },
        receivedBy: { select: { fullName: true } },
      },
      orderBy: { dispatchedAt: 'desc' }
    });
  }
}
