import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la catégorie est requis' })
  name: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}
