import 'reflect-metadata';
import { IsString, IsArray, IsOptional, IsNumber, ValidateNested, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
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

export class OrderCreatedDto {
  @IsString()
  orderId: string;

  @IsString()
  orderType: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @IsOptional()
  @IsNumber()
  departure?: number;

  @IsOptional()
  @ValidateIf(o => !o.destinationAddress)
  @IsNumber()
  destinationWh?: number;
  
  @IsOptional()
  @ValidateIf(o => !o.destinationWh)
  @ValidateNested()
  @Type(() => AddressDto)
  destinationAddress?: AddressDto;

  @IsOptional()
  @IsString()
  orderReference?: string;
}
