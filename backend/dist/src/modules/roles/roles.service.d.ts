import { PrismaService } from '../../core/prisma/prisma.service';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        permissions: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
