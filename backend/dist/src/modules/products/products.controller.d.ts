import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
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
    }>;
    findAll(): Promise<({
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
    })[]>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
        };
        units: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            conversionRate: number;
            isBaseUnit: boolean;
            productId: string;
        }[];
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
