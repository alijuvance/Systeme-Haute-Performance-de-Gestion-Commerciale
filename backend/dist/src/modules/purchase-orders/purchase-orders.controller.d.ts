import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
export declare class PurchaseOrdersController {
    private readonly purchaseOrdersService;
    constructor(purchaseOrdersService: PurchaseOrdersService);
    create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<{
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
    receive(id: string, receiveDto: ReceivePurchaseOrderDto, req: any): Promise<{
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
}
