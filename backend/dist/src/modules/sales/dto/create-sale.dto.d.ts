export declare class SaleLineDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreateSaleDto {
    type: string;
    customerId?: string;
    depotId: string;
    amountPaid?: number;
    lines: SaleLineDto[];
}
