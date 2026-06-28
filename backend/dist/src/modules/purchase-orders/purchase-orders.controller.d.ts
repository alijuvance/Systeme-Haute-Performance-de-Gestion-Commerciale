import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
export declare class PurchaseOrdersController {
    private readonly purchaseOrdersService;
    constructor(purchaseOrdersService: PurchaseOrdersService);
    create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<{
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
    receive(id: string, receiveDto: ReceivePurchaseOrderDto, req: any): Promise<{
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
}
