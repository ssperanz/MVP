import { CommandBus } from '@nestjs/cqrs';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductCommand } from './use-cases/command/create-product.command';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductCommand } from './use-cases/command/update-product.command';
import { ProductIdDto } from './dto/product-id.dto';
import { RemoveProductCommand } from './use-cases/command/remove-product.command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

    async createProduct(dto: CreateProductDto): Promise<void> {
      const command = new CreateProductCommand(
        dto.id,
        dto.name,
        dto.unitPrice,
        dto.availableQuantity,
        dto.minThres,
        dto.maxThres
      )
      return this.commandBus.execute(command);
    }

    async updateProduct(dto: UpdateProductDto): Promise<void> {
      const command = new UpdateProductCommand(
        dto.id,
        dto.name,
        dto.unitPrice,
        dto.availableQuantity,
        dto.minThres,
        dto.maxThres
      );
      return this.commandBus.execute(command);
    }
    
    async deleteProduct(dto: ProductIdDto): Promise<void> {
      return this.commandBus.execute(new RemoveProductCommand(dto.productId));
    }

}