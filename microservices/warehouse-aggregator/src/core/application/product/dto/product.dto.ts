import { IsNumber, IsPositive, IsString } from "class-validator";

export class ProductDto {
  //@IsNumber()
  //@IsPositive()
  //sourceWh: number;

  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @IsNumber()
  @IsPositive()
  availableQty: number;

  @IsNumber()
  @IsPositive()
  reservedQty: number;

  @IsNumber()
  @IsPositive()
  minThres: number;

  @IsNumber()
  @IsPositive()
  maxThres: number;
}
