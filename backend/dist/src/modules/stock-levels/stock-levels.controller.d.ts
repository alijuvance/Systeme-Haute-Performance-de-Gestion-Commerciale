import { StockLevelsService } from './stock-levels.service';
export declare class StockLevelsController {
    private readonly stockLevelsService;
    constructor(stockLevelsService: StockLevelsService);
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
