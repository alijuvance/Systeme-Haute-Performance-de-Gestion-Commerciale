import { IsString, IsOptional, IsUUID, IsArray, ValidateNested, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreditNoteLineDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}

export class CreateCreditNoteDto {
  @IsUUID()
  invoiceId: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreditNoteLineDto)
  lines: CreditNoteLineDto[];
}
