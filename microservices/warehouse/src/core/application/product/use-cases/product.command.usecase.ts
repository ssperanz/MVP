import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { ProductIdDto } from "../dto/product-id.dto";

export const IProductCommandUseCaseToken = Symbol('IProductCommandUseCase');

export interface ProductCommandUseCase {
  createProduct(dto: CreateProductDto): Promise<void>;
  updateProduct(dto: UpdateProductDto): Promise<void>;
  deleteProduct(productId: ProductIdDto): Promise<void>;
}