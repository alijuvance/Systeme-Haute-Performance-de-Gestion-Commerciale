import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto, req: any): Promise<{
        customer: {
            id: string;
            fullName: string | null;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            phone: string | null;
            address: string | null;
            taxId: string | null;
            companyName: string | null;
            creditLimit: number;
            currentDebt: number;
        };
        lines: {
            id: string;
            quantity: number;
            productId: string;
            unitPrice: number;
            discount: number;
            invoiceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        depotId: string;
        date: Date;
        type: string;
        status: string;
        totalAmount: number;
        invoiceNumber: string;
        dueDate: Date | null;
        taxAmount: number;
        amountPaid: number;
        customerId: string;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        depot: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            location: string | null;
        };
        customer: {
            id: string;
            fullName: string | null;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            phone: string | null;
            address: string | null;
            taxId: string | null;
            companyName: string | null;
            creditLimit: number;
            currentDebt: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        depotId: string;
        date: Date;
        type: string;
        status: string;
        totalAmount: number;
        invoiceNumber: string;
        dueDate: Date | null;
        taxAmount: number;
        amountPaid: number;
        customerId: string;
    })[]>;
}
