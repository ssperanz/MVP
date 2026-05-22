import { Controller, Get, Patch, Post } from "@nestjs/common";
import { ProductIdDto } from "./dto/product-id.dto";
import { ProductDto } from "./dto/product.dto";
import { ProductQueryService } from "./product.query.service";
import { InventoryDto } from "./dto/inventory.dto";

@Controller('products')
export class ProductController {
  constructor(
    private readonly productQueryService: ProductQueryService,
  ) {}

  @Get(':id')
  async getProductById(dto: ProductIdDto): Promise<ProductDto[] | null> {
    return this.productQueryService.getProductById(dto);
  }

  @Get('warehouse/:whId')
  async getProductByWhId(whId: number): Promise<ProductDto[] | null> {
    return this.productQueryService.getProductByWhId(whId);
  }

  @Get()
  async getInventory(): Promise<InventoryDto> {
    return this.productQueryService.listProducts();
  }
}