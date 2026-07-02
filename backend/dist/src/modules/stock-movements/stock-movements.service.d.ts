import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
export declare class StockMovementsService {
    private prisma;
    constructor(prisma: PrismaService);
    registerMovement(dto: CreateStockMovementDto, userId: string): Promise<{
        depotId: string;
        id: string;
        createdAt: Date;
        type: string;
        productId: string;
        date: Date;
        reference: string | null;
        quantityChanged: number;
        userId: string;
    }>;
    findAll(): Promise<({
        user: {
            email: string;
            fullName: string;
            roleId: string;
            avatar: string | null;
            depotId: string | null;
            isActive: boolean;
            id: string;
            passwordHash: string;
            resetOtp: string | null;
            resetOtpExpiresAt: Date | null;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        product: {
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
    } & {
        depotId: string;
        id: string;
        createdAt: Date;
        type: string;
        productId: string;
        date: Date;
        reference: string | null;
        quantityChanged: number;
        userId: string;
    })[]>;
}
