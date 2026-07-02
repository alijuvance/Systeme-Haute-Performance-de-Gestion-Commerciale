import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
