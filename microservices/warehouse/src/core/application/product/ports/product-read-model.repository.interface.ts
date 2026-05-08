export const IProductReadModelRepositoryToken = Symbol('IProductReadModelRepository');

export interface ProductReadModelRepository {
  findById(productId: string): Promise<ProductReadModel | null>;
  findAll(): Promise<ProductReadModel[]>;
  upsert(product: ProductReadModel): Promise<void>;
  delete(productId: string): Promise<void>;
}

export interface ProductReadModel {
  productId: string;
  name: string;
  unitPrice: number;
  availableQty: number;
  reservedQty: number;
  minThres: number;
  maxThres: number;
}
