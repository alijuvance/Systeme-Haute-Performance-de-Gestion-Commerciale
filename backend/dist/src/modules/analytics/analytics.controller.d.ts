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
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            fullName: string | null;
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
        type: string;
        date: Date;
        status: string;
        totalAmount: number;
        amountPaid: number;
        customerId: string;
        invoiceNumber: string;
        dueDate: Date | null;
        taxAmount: number;
    })[]>;
    getFinanceKPIs(): Promise<{
        netCash: number;
        totalReceivables: number;
        totalPayables: number;
        commercialMargin: number;
    }>;
    getCashflowChart(): Promise<{
        date: string;
        inflows: number;
        outflows: number;
    }[]>;
    getPayables(): Promise<({
        supplier: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            contactName: string | null;
            phone: string | null;
            address: string | null;
            taxId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        status: string;
        supplierId: string;
        receivingDepotId: string | null;
        orderNumber: string;
        expectedDate: Date | null;
        totalAmount: number;
        amountPaid: number;
    })[]>;
}
