export const IProductCriticalEventPublisherToken = Symbol('IProductCriticalEventPublisher');

export interface ProductCriticalEventPublisher {
  publishCriticalMinThresEvent(productId: string, minThres: number, currentQty: number): Promise<void>;
  publishCriticalMaxThresEvent(productId: string, maxThres: number, currentQty: number): Promise<void>;
}