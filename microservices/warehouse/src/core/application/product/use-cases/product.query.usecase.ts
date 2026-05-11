import { InventoryDto } from "../dto/inventory.dto";
import { ProductIdDto } from "../dto/product-id.dto";
import { ProductDto } from "../dto/product.dto";

export interface ProductQueryUseCase {
  getProductById(productId: ProductIdDto): Promise<ProductDto>;
  listProducts(): Promise<InventoryDto>;
}