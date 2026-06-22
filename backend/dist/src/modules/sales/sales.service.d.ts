import { PrismaService } from '../../core/prisma/prisma.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { CustomersService } from '../customers/customers.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesService {
    private prisma;
    private stockMovementsService;
    private customersService;
    constructor(prisma: PrismaService, stockMovementsService: StockMovementsService, customersService: CustomersService);
    createSale(dto: CreateSaleDto, userId: string): Promise<{
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
