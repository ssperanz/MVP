import { IsNumber, IsString } from 'class-validator';

export class UpdateOrderStateDto {
  @IsNumber()
  sourceWh: number;

  @IsString()
  orderId: string;

  @IsString()
  newState: string;

  @IsString()
  orderType: string;
}
