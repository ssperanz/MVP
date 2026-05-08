import { ProductId } from '../../../../shared/domain/value-objects/product-id.vo';
import { Product } from '../../../domain/product/entities/product.entity';

export const IProductRepositoryToken = Symbol('IProductRepository');
export interface ProductRepository {
    save(product: Product): Promise<any>;
    delete(id: ProductId): Promise<any>;
    loadAll(): Promise<Product[]>;
    loadById(id: ProductId): Promise<Product | null>;
}