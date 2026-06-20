import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER_OUT = 'TRANSFER_OUT',
  TRANSFER_IN = 'TRANSFER_IN',
}

export class CreateStockMovementDto {
  @IsEnum(MovementType)
  @IsNotEmpty()
  type: MovementType;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsNumber()
  quantityChanged: number;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  depotId: string;
}
