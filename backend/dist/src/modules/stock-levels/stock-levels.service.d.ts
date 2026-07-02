import { PrismaService } from '../../core/prisma/prisma.service';
export declare class StockLevelsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(depotId?: string): Promise<{
        firstAddedAt: Date;
        lastAddedAt: Date;
        product: {
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                parentId: string | null;
            };
        } & {
            isActive: boolean;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            barcode: string | null;
            description: string | null;
            defaultPrice: number;
            costPrice: number;
            categoryId: string;
        };
        depot: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        };
        depotId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        minAlertQuantity: number;
    }[]>;
}
