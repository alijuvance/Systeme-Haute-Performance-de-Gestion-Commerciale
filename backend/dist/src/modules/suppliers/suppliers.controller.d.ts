import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(createSupplierDto: CreateSupplierDto): import("@prisma/client").Prisma.Prisma__SupplierClient<{
        name: string;
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        contactName: string | null;
        phone: string | null;
        address: string | null;
        taxId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        contactName: string | null;
        phone: string | null;
        address: string | null;
        taxId: string | null;
    }[]>;
}
