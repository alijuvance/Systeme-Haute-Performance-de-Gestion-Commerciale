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
            id: string;
            fullName: string | null;
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
        depotId: string;
        date: Date;
        type: string;
        status: string;
        totalAmount: number;
        invoiceNumber: string;
        dueDate: Date | null;
        taxAmount: number;
        amountPaid: number;
        customerId: string;
    })[]>;
}
