import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
export declare class StockMovementsService {
    private prisma;
    constructor(prisma: PrismaService);
    registerMovement(dto: CreateStockMovementDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        depotId: string;
        type: string;
        productId: string;
        date: Date;
        reference: string | null;
        quantityChanged: number;
        userId: string;
    }>;
    findAll(): Promise<({
        depot: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            location: string | null;
            type: string;
        };
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            fullName: string;
            isActive: boolean;
            resetOtp: string | null;
            resetOtpExpiresAt: Date | null;
            roleId: string;
            avatar: string | null;
            lastLogin: Date | null;
            depotId: string | null;
        };
        product: {
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
    } & {
        id: string;
        createdAt: Date;
        depotId: string;
        type: string;
        productId: string;
        date: Date;
        reference: string | null;
        quantityChanged: number;
        userId: string;
    })[]>;
}
