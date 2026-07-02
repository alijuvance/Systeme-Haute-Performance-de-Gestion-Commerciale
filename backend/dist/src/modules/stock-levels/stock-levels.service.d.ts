import { PrismaService } from '../../core/prisma/prisma.service';
export declare class StockLevelsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(depotId?: string): Promise<{
        firstAddedAt: Date;
        lastAddedAt: Date;
        depot: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        };
        product: {
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                parentId: string | null;
            };
        } & {
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        depotId: string;
        productId: string;
        quantity: number;
        minAlertQuantity: number;
    }[]>;
}
