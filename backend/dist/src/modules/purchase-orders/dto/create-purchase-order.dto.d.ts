export declare class PurchaseOrderLineDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreatePurchaseOrderDto {
    supplierId: string;
    lines: PurchaseOrderLineDto[];
}
