import { InventoryDto } from "../dto/inventory.dto";
import { ProductIdDto } from "../dto/product-id.dto";
import { ProductDto } from "../dto/product.dto";

export interface ProductQueryUseCase {
  getProductById(productId: ProductIdDto): Promise<ProductDto[] | null>;
  getProductByWhId(whId: number): Promise<ProductDto[] | null>;
  listProducts(): Promise<InventoryDto>;
}