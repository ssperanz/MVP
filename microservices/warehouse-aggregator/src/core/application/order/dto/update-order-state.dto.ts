import { IsNumber, IsString } from 'class-validator';

export class UpdateOrderStateDto {
  @IsString()
  orderId: string;

  @IsString()
  orderState: string;
}
