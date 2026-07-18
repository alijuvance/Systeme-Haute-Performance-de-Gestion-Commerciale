import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ReceiveOrderLineDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantityReceived: number;
}

export class ReceivePurchaseOrderDto {
  @IsString()
  @IsNotEmpty()
  receivingDepotId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiveOrderLineDto)
  lines: ReceiveOrderLineDto[];
}
