import { IsArray, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { OrderItemDto } from './create-order.dto';
import { Type } from 'class-transformer';

export class OrderDispatchedDto {
  @IsString()
  orderId: string;

  @IsString()
  orderType: string;

  @IsNumber()
  sourceWh: number;

  @IsNumber()
  destinationWh: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  orderReference?: string;
}
