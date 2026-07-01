import { PrismaService } from '../../core/prisma/prisma.service';
export interface AppNotification {
    id: string;
    type: 'WARNING' | 'ERROR' | 'INFO';
    title: string;
    message: string;
    link: string;
    date: Date;
}
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getNotifications(): Promise<AppNotification[]>;
}
