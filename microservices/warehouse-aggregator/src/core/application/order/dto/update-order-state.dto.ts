import { IsString } from 'class-validator';

export class UpdateOrderStateDto {
  @IsString()
  orderId: string;

  @IsString()
  newState: string;

  @IsString()
  orderType: string;
}
