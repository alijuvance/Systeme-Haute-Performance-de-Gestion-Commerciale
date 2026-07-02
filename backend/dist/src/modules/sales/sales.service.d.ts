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
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            fullName: string | null;
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
        depotId: string;
        type: string;
        date: Date;
        status: string;
        totalAmount: number;
        amountPaid: number;
        customerId: string;
        invoiceNumber: string;
        dueDate: Date | null;
        taxAmount: number;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        depot: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        };
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            fullName: string | null;
            type: string;
            phone: string | null;
            address: string | null;
            taxId: string | null;
            companyName: string | null;
            creditLimit: number;
            currentDebt: number;
        };
        lines: ({
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
        } & {
            id: string;
            productId: string;
            quantity: number;
            unitPrice: number;
            discount: number;
            invoiceId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        depotId: string;
        type: string;
        date: Date;
        status: string;
        totalAmount: number;
        amountPaid: number;
        customerId: string;
        invoiceNumber: string;
        dueDate: Date | null;
        taxAmount: number;
    })[]>;
}
