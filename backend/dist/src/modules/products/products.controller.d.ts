import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
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
    }>;
    findAll(): Promise<({
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
        };
        units: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            conversionRate: number;
            isBaseUnit: boolean;
            productId: string;
        }[];
    } & {
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
