import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getKPIs(): Promise<{
        totalRevenue: number;
        totalReceivables: number;
        commercialMargin: number;
        totalCogs: number;
    }>;
    getSalesChart(): Promise<{
        date: string;
        amount: any;
    }[]>;
    getDebts(): Promise<({
        customer: {
            email: string | null;
            fullName: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            phone: string | null;
            address: string | null;
            taxId: string | null;
            companyName: string | null;
            creditLimit: number;
            currentDebt: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        depotId: string;
        date: Date;
        status: string;
        totalAmount: number;
        customerId: string;
        amountPaid: number;
        invoiceNumber: string;
        dueDate: Date | null;
        taxAmount: number;
    })[]>;
}
