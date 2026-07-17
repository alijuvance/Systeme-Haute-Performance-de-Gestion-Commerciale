import { IsNumber, IsString, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  method: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsUUID()
  invoiceId: string;
}
