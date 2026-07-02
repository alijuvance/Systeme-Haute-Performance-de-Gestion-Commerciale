import { PrismaService } from '../../core/prisma/prisma.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { DispatchTransferDto } from './dto/dispatch-transfer.dto';
export declare class StockTransfersService {
    private prisma;
    private stockMovementsService;
    constructor(prisma: PrismaService, stockMovementsService: StockMovementsService);
    dispatchTransfer(dto: DispatchTransferDto, userId: string): Promise<{
        id: string;
        productId: string;
        quantity: number;
        reference: string;
        fromDepotId: string;
        toDepotId: string;
        status: string;
        dispatchedAt: Date;
        receivedAt: Date | null;
        dispatchedById: string;
        receivedById: string | null;
    }>;
    receiveTransfer(transferId: string, userId: string): Promise<{
        id: string;
        productId: string;
        quantity: number;
        reference: string;
        fromDepotId: string;
        toDepotId: string;
        status: string;
        dispatchedAt: Date;
        receivedAt: Date | null;
        dispatchedById: string;
        receivedById: string | null;
    }>;
    findAll(): Promise<({
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            sku: string;
            barcode: string | null;
            description: string | null;
            defaultPrice: number;
            costPrice: number;
            categoryId: string;
        };
        fromDepot: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        };
        toDepot: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        };
        dispatchedBy: {
            fullName: string;
        };
        receivedBy: {
            fullName: string;
        } | null;
    } & {
        id: string;
        productId: string;
        quantity: number;
        reference: string;
        fromDepotId: string;
        toDepotId: string;
        status: string;
        dispatchedAt: Date;
        receivedAt: Date | null;
        dispatchedById: string;
        receivedById: string | null;
    })[]>;
}
