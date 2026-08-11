import type { ProductReadModel } from "src/infrastructure/persistence/mongodb/schemas/product-read-model.schema";
import { ProductCreatedDto, ProductDeletedDto, ProductUpdatedDto } from "./product-event-listener.port";

export const IProductReadModelRepositoryToken = Symbol('IProductReadModelRepository');

export interface ProductReadModelRepository {
  findByProductId(productId: string): Promise<ProductReadModel[] | null>;
  findByWhId(whId: number): Promise<ProductReadModel[]>;
  findAll(): Promise<ProductReadModel[]>;
  upsert(dto: ProductCreatedDto, sourceWh: number): Promise<void>;
  update(dto: ProductUpdatedDto, sourceWh: number): Promise<void>;
  delete(dto: ProductDeletedDto, sourceWh: number): Promise<void>;
}
