export const IProductReadModelRepositoryToken = Symbol('IProductReadModelRepository');

export interface ProductReadModelRepository {
  findByProductId(productId: string): Promise<ProductReadModel[] | null>;
  findByWhId(whId: number): Promise<ProductReadModel[]>;
  findAll(): Promise<ProductReadModel[]>;
  upsert(product: ProductReadModel): Promise<void>;
  delete(productId: string): Promise<void>;
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
