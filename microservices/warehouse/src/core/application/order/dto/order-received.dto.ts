import { IsArray, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';

export class OrderReceivedDto {
  @IsString()
  orderId: string;

  @IsNumber()
  sourceWh: number;

  @IsNumber()
  destinationWh: number;
}
