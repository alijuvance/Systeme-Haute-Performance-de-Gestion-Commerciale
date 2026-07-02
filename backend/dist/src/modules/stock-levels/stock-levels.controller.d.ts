import { StockLevelsService } from './stock-levels.service';
export declare class StockLevelsController {
    private readonly stockLevelsService;
    constructor(stockLevelsService: StockLevelsService);
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
