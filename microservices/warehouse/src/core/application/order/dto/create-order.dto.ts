import 'reflect-metadata';
import { IsString, IsArray, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  qty: number;
}

export class AddressDto {
  @IsString()
  streetName: string;

  @IsNumber()
  civicNumber: number;

  @IsString()
  city: string;

  @IsString()
  cap: string;

  @IsString()
  country: string;
}

export class CreateOrderDto {
  @IsString()
  orderType: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsNumber()
  departure?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  destinationAddress?: AddressDto;

  @IsOptional()
  @IsNumber()
  destinationWh?: number;

  @IsOptional()
  @IsString()
  orderReference?: string;
}
