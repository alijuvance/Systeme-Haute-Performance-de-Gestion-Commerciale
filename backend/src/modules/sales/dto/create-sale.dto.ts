import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleLineDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['B2B', 'POS'])
  type: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsNotEmpty()
  depotId: string;

  @IsNumber()
  @IsOptional()
  amountPaid?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleLineDto)
  lines: SaleLineDto[];
}
