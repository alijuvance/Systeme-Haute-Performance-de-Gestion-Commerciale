import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['B2B', 'B2C'])
  type: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  taxId?: string;
}
