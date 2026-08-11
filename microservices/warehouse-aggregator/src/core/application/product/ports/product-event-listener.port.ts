export interface ProductEventListener {
  onProductCreated(dto: ProductCreatedDto): Promise<void>;
  onProductUpdated(dto: ProductUpdatedDto): Promise<void>;
  onProductDeleted(dto: ProductDeletedDto): Promise<void>;
}

export interface ProductCreatedDto {
  //sourceWh: number;
  productId: string;
  name: string;
  unitPrice: number;
  availableQty: number;
  reservedQty: number;
  minThres: number;
  maxThres: number;
}

export interface ProductUpdatedDto {
  //sourceWh: number;
  productId: string;
  name?: string;
  unitPrice?: number;
  availableQty?: number;
  reservedQty?: number;
  minThres?: number;
  maxThres?: number;
}

export interface ProductDeletedDto {
  //sourceWh: number;
  productId: string;
}