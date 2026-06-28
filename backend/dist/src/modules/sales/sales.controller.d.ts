import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto, req: any): Promise<{
        customer: {
            email: string | null;
            fullName: string | null;
            id: string;
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
            productId: string;
            quantity: number;
            unitPrice: number;
            discount: number;
            invoiceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        depotId: string;
        date: Date;
        status: string;
        totalAmount: number;
        customerId: string;
        amountPaid: number;
        invoiceNumber: string;
        dueDate: Date | null;
        taxAmount: number;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        depot: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        };
        customer: {
            email: string | null;
            fullName: string | null;
            id: string;
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
        type: string;
        depotId: string;
        date: Date;
        status: string;
        totalAmount: number;
        customerId: string;
        amountPaid: number;
        invoiceNumber: string;
        dueDate: Date | null;
        taxAmount: number;
    })[]>;
}
