import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DispatchTransferDto {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  fromDepotId: string;

  @IsString()
  @IsNotEmpty()
  toDepotId: string;
}
