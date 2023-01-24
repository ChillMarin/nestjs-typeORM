import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUrl,
  IsPositive,
} from 'class-validator';

import { PartialType, ApiProperty } from '@nestjs/swagger'

export class CreateProductDto {
  // readonly es que no quiero que se manipule solo que sea de tipo lectura, es decir el atributo no puede ser modificado
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  readonly stock: number;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  readonly image: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  readonly brandId: number;
}

// aqui hace las mismas validaciones del padre pero cada una de ellas va a ser opcional
export class UpdateProductDto extends PartialType(CreateProductDto) {

}
