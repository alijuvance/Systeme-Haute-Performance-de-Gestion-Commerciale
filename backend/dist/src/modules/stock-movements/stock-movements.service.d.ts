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
        type: string;
        reference: string | null;
        quantityChanged: number;
        date: Date;
        userId: string;
    }>;
    findAll(): Promise<({
        user: {
            email: string;
            fullName: string;
            roleId: string;
            id: string;
            passwordHash: string;
            isActive: boolean;
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
            location: string | null;
            type: string;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        depotId: string;
        type: string;
        reference: string | null;
        quantityChanged: number;
        date: Date;
        userId: string;
    })[]>;
}
