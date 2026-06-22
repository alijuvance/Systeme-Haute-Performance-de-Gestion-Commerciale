import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto): Promise<{
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
}
