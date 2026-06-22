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
            name: string;
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            contactName: string | null;
            phone: string | null;
            address: string | null;
            taxId: string | null;
        };
        lines: {
            id: string;
            quantity: number;
            productId: string;
            unitPrice: number;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: string;
        orderNumber: string;
        expectedDate: Date | null;
        totalAmount: number;
        supplierId: string;
        receivingDepotId: string | null;
    }>;
    receive(id: string, dto: ReceivePurchaseOrderDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: string;
        orderNumber: string;
        expectedDate: Date | null;
        totalAmount: number;
        supplierId: string;
        receivingDepotId: string | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        supplier: {
            name: string;
            id: string;
            email: string | null;
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
            type: string;
            location: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: string;
        orderNumber: string;
        expectedDate: Date | null;
        totalAmount: number;
        supplierId: string;
        receivingDepotId: string | null;
    })[]>;
}
