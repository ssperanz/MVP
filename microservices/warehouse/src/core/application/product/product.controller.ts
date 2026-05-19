import { Controller } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductIdDto } from "./dto/product-id.dto";

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<void> {
    return this.productService.createProduct(dto);
  }

  async updateProduct(dto: UpdateProductDto): Promise<void> {
    return this.productService.updateProduct(dto);
  }
  
  async deleteProduct(dto: ProductIdDto): Promise<void> {
    return this.productService.deleteProduct(dto);
  }
}