import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateSupplierDto): import("@prisma/client").Prisma.Prisma__SupplierClient<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contactName: string | null;
        phone: string | null;
        address: string | null;
        taxId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contactName: string | null;
        phone: string | null;
        address: string | null;
        taxId: string | null;
    }[]>;
    update(id: string, data: any): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contactName: string | null;
        phone: string | null;
        address: string | null;
        taxId: string | null;
    }>;
    remove(id: string): Promise<{
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contactName: string | null;
        phone: string | null;
        address: string | null;
        taxId: string | null;
    }>;
}
