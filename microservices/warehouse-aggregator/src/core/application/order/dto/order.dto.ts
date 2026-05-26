import { IsArray, IsDate, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { AddressDto, OrderItemDto } from "./order-created.dto";

export class OrderDto {
  @IsNumber()
  @IsPositive()
  sourceWh: number;

  @IsString()
  orderId: string;

  @IsArray()
  orderItems: OrderItemDto[];

  @IsString()
  orderType: string;

  @IsString()
  orderState: string;

  @IsDate()
  orderCreationDate: Date;

  @IsNumber()
  departureWh: number;

  @IsNumber()
  @IsPositive()
  totalOrderValue: number;

  @IsArray()
  @IsOptional()
  destination?: AddressDto;
  
  @IsNumber()
  @IsOptional()
  destinationWh?: number;

  @IsString()
  @IsOptional()
  orderReference?: string;
}
