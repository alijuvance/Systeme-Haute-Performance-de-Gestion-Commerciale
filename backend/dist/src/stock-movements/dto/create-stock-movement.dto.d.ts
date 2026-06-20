export declare enum MovementType {
    IN = "IN",
    OUT = "OUT",
    TRANSFER_OUT = "TRANSFER_OUT",
    TRANSFER_IN = "TRANSFER_IN"
}
export declare class CreateStockMovementDto {
    type: MovementType;
    reference?: string;
    quantityChanged: number;
    productId: string;
    depotId: string;
}
