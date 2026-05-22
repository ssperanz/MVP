import { ProductIdDto } from "../dto/product-id.dto";
import { ProductCreatedDto, ProductDeletedDto, ProductUpdatedDto } from "./product-event-listener.port";

export const IProductReadModelRepositoryToken = Symbol('IProductReadModelRepository');

export interface ProductReadModelRepository {
  findByProductId(productId: string): Promise<ProductReadModel[] | null>;
  findByWhId(whId: number): Promise<ProductReadModel[]>;
  findAll(): Promise<ProductReadModel[]>;
  upsert(dto: ProductCreatedDto): Promise<void>;
  update(dto: ProductUpdatedDto): Promise<void>;
  delete(dto: ProductDeletedDto): Promise<void>;
}

export interface ProductReadModel {
  sourceWh: number;
  productId: string;
  name: string;
  unitPrice: number;
  availableQty: number;
  reservedQty: number;
  minThres: number;
  maxThres: number;
}
