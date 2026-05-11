import 'reflect-metadata';
import { IsString, IsNumber, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    unitPrice: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    availableQuantity: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minThres: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxThres: number;
}