import { Controller, Get, Patch, Post } from "@nestjs/common";
import { ProductIdDto } from "./dto/product-id.dto";
import { ProductDto } from "./dto/product.dto";
import { ProductQueryFacade } from "./product.query.facade";
import { InventoryDto } from "./dto/inventory.dto";

@Controller('products')
export class ProductController {
  constructor(
    private readonly productQueryFacade: ProductQueryFacade,
  ) {}

  @Get(':id')
  async getProductById(dto: ProductIdDto): Promise<ProductDto[] | null> {
    return this.productQueryFacade.getProductById(dto);
  }

  @Get(':whId')
  async getProductByWhId(whId: number): Promise<ProductDto[] | null> {
    return this.productQueryFacade.getProductByWhId(whId);
  }

  @Get()
  async getInventory(): Promise<InventoryDto> {
    return this.productQueryFacade.listProducts();
  }
}