import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
export declare class StockMovementsService {
    private prisma;
    constructor(prisma: PrismaService);
    registerMovement(dto: CreateStockMovementDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        depotId: string;
        date: Date;
        type: string;
        reference: string | null;
        quantityChanged: number;
        userId: string;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            passwordHash: string;
            fullName: string;
            isActive: boolean;
            roleId: string;
            createdAt: Date;
            updatedAt: Date;
        };
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
        productId: string;
        depotId: string;
        date: Date;
        type: string;
        reference: string | null;
        quantityChanged: number;
        userId: string;
    })[]>;
}
