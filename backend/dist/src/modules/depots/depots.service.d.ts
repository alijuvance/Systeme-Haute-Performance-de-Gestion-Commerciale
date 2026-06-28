import { PrismaService } from '../../core/prisma/prisma.service';
export declare class DepotsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        type: string;
    }[]>;
    create(data: {
        name: string;
        location?: string;
        type: string;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        type: string;
    }>;
}
