import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCustomerDto): Promise<{
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
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    getOrCreateGenericPosCustomer(): Promise<{
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
    }>;
}
