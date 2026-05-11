import { IsString } from 'class-validator';

export class OrderDispatchedDto {
  @IsString()
  orderId: string;
}
