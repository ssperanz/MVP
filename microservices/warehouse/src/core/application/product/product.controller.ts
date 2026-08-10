import { Body, Controller, Get, Inject, Param, Patch, Post } from "@nestjs/common";
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
    @Inject('IProductCommandUseCase')
    private readonly productCommandUseCase: ProductCommandUseCase,

    @Inject('IProductQueryUseCase')
    private readonly productQueryUseCase: ProductQueryUseCase,
  ) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDto): Promise<void> {
    return this.productCommandUseCase.createProduct(dto);
  }

  @Post(':id')
  async updateProduct(@Body() dto: UpdateProductDto): Promise<void> {
    return this.productCommandUseCase.updateProduct(dto);
  }

  @Patch(':id/delete')
  async deleteProduct(
    @Param('id') productId: string,
  ): Promise<void> {
    return this.productCommandUseCase.deleteProduct({ productId });
  }

  @Get(':id')
  async getProductById(
    @Param('id') productId: string,
  ): Promise<ProductDto | null> {
    return this.productQueryUseCase.getProductById({ productId });
  }

  @Get()
  async getInventory(): Promise<InventoryDto> {
    return this.productQueryUseCase.listProducts();
  }
}