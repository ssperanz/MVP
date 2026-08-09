import { CommandBus } from '@nestjs/cqrs';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let productService: ProductService;
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = {
      execute: jest.fn(),
    } as unknown as CommandBus;

    productService = new ProductService(commandBus);
  });

  it('should create a product', async () => {
    const createProductDto: CreateProductDto = {
      id: 'product-1',
      name: 'Product 1',
      unitPrice: 10,
      availableQuantity: 100,
      minThres: 10,
      maxThres: 200,
    };

    await productService.createProduct(createProductDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        id: createProductDto.id,
        name: createProductDto.name,
        price: createProductDto.unitPrice,
        quantity: createProductDto.availableQuantity,
        minThres: createProductDto.minThres,
        maxThres: createProductDto.maxThres
      })
    );
  });

  it('should update a product', async () => {
    const updateProductDto = {
      id: 'product-1',
      name: 'Updated Product 1',
      unitPrice: 15,
      availableQuantity: 150,
      minThres: 20,
      maxThres: 250,
    };

    await productService.updateProduct(updateProductDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        id: updateProductDto.id,
        name: updateProductDto.name,
        price: updateProductDto.unitPrice,
        quantity: updateProductDto.availableQuantity,
        minThres: updateProductDto.minThres,
        maxThres: updateProductDto.maxThres
      })
    );
  });

  it('should delete a product', async () => {
    const productIdDto = { productId: 'product-1' };

    await productService.deleteProduct(productIdDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        id: productIdDto.productId
      })
    );
  });
});
