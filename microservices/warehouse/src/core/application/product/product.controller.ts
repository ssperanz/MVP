import { Controller, Get, Patch, Post } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductIdDto } from "./dto/product-id.dto";
import { ProductDto } from "./dto/product.dto";
import { InventoryDto } from "./dto/inventory.dto";
import type { ProductCommandUseCase } from "./use-cases/product.command.usecase";
import type { ProductQueryUseCase } from "./use-cases/product.query.usecase";

@Controller('products')
export class ProductController {
  constructor(
    private readonly productCommandUseCase: ProductCommandUseCase,
    private readonly productQueryUseCase: ProductQueryUseCase,
  ) {}

  @Post()
  async createProduct(dto: CreateProductDto): Promise<void> {
    return this.productCommandUseCase.createProduct(dto);
  }

  @Post(':id')
  async updateProduct(dto: UpdateProductDto): Promise<void> {
    return this.productCommandUseCase.updateProduct(dto);
  }
  
  @Patch(':id/delete')
  async deleteProduct(dto: ProductIdDto): Promise<void> {
    return this.productCommandUseCase.deleteProduct(dto);
  }

  @Get(':id')
  async getProductById(dto: ProductIdDto): Promise<ProductDto | null> {
    return this.productQueryUseCase.getProductById(dto);
  }

  @Get()
  async getInventory(): Promise<InventoryDto> {
    return this.productQueryUseCase.listProducts();
  }
}