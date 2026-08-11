import { IsNumber, IsString } from 'class-validator';

export class UpdateOrderStateDto {
  @IsNumber()
  sourceWh: number;

  @IsString()
  orderId: string;

  @IsString()
  orderState: string;
}
