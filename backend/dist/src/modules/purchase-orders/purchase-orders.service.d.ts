import { PrismaService } from '../../core/prisma/prisma.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
export declare class PurchaseOrdersService {
    private prisma;
    private stockMovementsService;
    constructor(prisma: PrismaService, stockMovementsService: StockMovementsService);
    create(dto: CreatePurchaseOrderDto): Promise<{
        supplier: {
            email: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            contactName: string | null;
            phone: string | null;
            address: string | null;
            taxId: string | null;
        };
        lines: {
            id: string;
            productId: string;
            quantity: number;
            unitPrice: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: string;
        supplierId: string;
        receivingDepotId: string | null;
        orderNumber: string;
        expectedDate: Date | null;
        totalAmount: number;
    }>;
    receive(id: string, dto: ReceivePurchaseOrderDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: string;
        supplierId: string;
        receivingDepotId: string | null;
        orderNumber: string;
        expectedDate: Date | null;
        totalAmount: number;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        supplier: {
            email: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            contactName: string | null;
            phone: string | null;
            address: string | null;
            taxId: string | null;
        };
        receivingDepot: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: string;
        supplierId: string;
        receivingDepotId: string | null;
        orderNumber: string;
        expectedDate: Date | null;
        totalAmount: number;
    })[]>;
}
