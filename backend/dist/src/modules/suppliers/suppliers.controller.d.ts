import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(createSupplierDto: CreateSupplierDto): import("@prisma/client").Prisma.Prisma__SupplierClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        contactName: string | null;
        phone: string | null;
        address: string | null;
        taxId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        contactName: string | null;
        phone: string | null;
        address: string | null;
        taxId: string | null;
    }[]>;
    update(id: string, updateSupplierDto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        contactName: string | null;
        phone: string | null;
        address: string | null;
        taxId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        contactName: string | null;
        phone: string | null;
        address: string | null;
        taxId: string | null;
    }>;
}
