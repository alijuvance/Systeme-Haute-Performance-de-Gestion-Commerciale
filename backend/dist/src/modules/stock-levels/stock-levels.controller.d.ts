import { StockLevelsService } from './stock-levels.service';
export declare class StockLevelsController {
    private readonly stockLevelsService;
    constructor(stockLevelsService: StockLevelsService);
    findAll(): Promise<({
        product: {
            name: string;
            id: string;
            isActive: boolean;
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
            type: string;
            location: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        minAlertQuantity: number;
        productId: string;
        depotId: string;
    })[]>;
}
