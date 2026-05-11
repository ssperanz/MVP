import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { ProductDto } from "../dto/product.dto";
import { ProductIdDto } from "../dto/product-id.dto";

export interface ProductCommandUseCase {
  createProduct(dto: CreateProductDto): Promise<ProductDto>;
  updateProduct(dto: UpdateProductDto): Promise<ProductDto>;
  deleteProduct(productId: ProductIdDto): Promise<void>;
}