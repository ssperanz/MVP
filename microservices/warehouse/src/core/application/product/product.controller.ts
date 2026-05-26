import { Controller, Get, Patch, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductIdDto } from "./dto/product-id.dto";
import { ProductDto } from "./dto/product.dto";
import { ProductQueryService } from "./product.query.service";
import { InventoryDto } from "./dto/inventory.dto";

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productQueryService: ProductQueryService,
  ) {}

  @Post()
  async createProduct(dto: CreateProductDto): Promise<void> {
    return this.productService.createProduct(dto);
  }

  @Post(':id')
  async updateProduct(dto: UpdateProductDto): Promise<void> {
    return this.productService.updateProduct(dto);
  }
  
  @Patch(':id/delete')
  async deleteProduct(dto: ProductIdDto): Promise<void> {
    return this.productService.deleteProduct(dto);
  }

  @Get(':id')
  async getProductById(dto: ProductIdDto): Promise<ProductDto | null> {
    return this.productQueryService.getProductById(dto);
  }

  @Get()
  async getInventory(): Promise<InventoryDto> {
    return this.productQueryService.listProducts();
  }
}