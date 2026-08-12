import axios from 'axios';

describe('Warehouse → Warehouse Aggregator product synchronization', () => {
  const warehouseUrl = 'http://localhost:3000';
  const aggregatorUrl = 'http://localhost:3110';

  async function waitForProduct(productId: string, url: string, timeout = 5000,): Promise<any> {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      try {
        const response = await axios.get(
          `${url}/products/${productId}`,
        );

        const product = response.data?.find(
          (p: any) => p.productId === productId,
        );

        if (product) {
          return product;
        }
      } catch {
        // Product not synchronized yet
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw new Error(
      `Product ${productId} was not synchronized within ${timeout}ms`,
    );
  }

  it('should successfully create a product in the warehouse', async () => {
    const product = {
      id: `system-test-${Date.now()}`,
      name: 'System Test Product',
      unitPrice: 10,
      availableQuantity: 100,
      reservedQuantity: 0,
      minThres: 10,
      maxThres: 200,
    };

    // 1. Create product through Warehouse API
    const response = await axios.post(
        `${warehouseUrl}/products`,
        product,
    );
  
    expect(response.status).toBe(201);

  });


  it('should retrieve a created product from the warehouse', async () => {
    const product = {
      id: `system-test-${Date.now()}`,
      name: 'System Test Product',
      unitPrice: 10,
      availableQuantity: 100,
      reservedQuantity: 0,
      minThres: 10,
      maxThres: 200,
    };

    // Create product
    const createResponse = await axios.post(
      `${warehouseUrl}/products`,
      product,
    );

    expect(createResponse.status).toBe(201);

    // Retrieve product
    const getResponse = await axios.get(
      `${warehouseUrl}/products/${product.id}`,
    );

    expect(getResponse.status).toBe(200);

    console.log('Product:', product);
    expect(getResponse.data).toMatchObject({
      productId: product.id,
      name: product.name,
      unitPrice: product.unitPrice,
      availableQty: product.availableQuantity,
      reservedQty: product.reservedQuantity,
      minThres: product.minThres,
      maxThres: product.maxThres,
    });
  });

  it('should synchronize a created product with the aggregator', async () => {
    const product = {
      id: `system-test-${Date.now()}`,
      name: 'System Test Product',
      unitPrice: 10,
      availableQuantity: 100,
      reservedQuantity: 0,
      minThres: 10,
      maxThres: 200,
    };

    // 1. Create product through Warehouse API
    let createResponse;

    try {
      createResponse = await axios.post(
        `${warehouseUrl}/products`,
        product,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Warehouse response:', error.response?.data);
        console.error('Warehouse status:', error.response?.status);
      }

      throw error;
    }

    expect(createResponse.status).toBe(201);

    // 2. Wait for Aggregator synchronization
    const aggregatedProduct = await waitForProduct(product.id, aggregatorUrl);

    // 3. Verify synchronization
    expect(aggregatedProduct).toMatchObject({
      productId: product.id,
      name: product.name,
      unitPrice: product.unitPrice,
      availableQty: product.availableQuantity,
      reservedQty: product.reservedQuantity,
      minThres: product.minThres,
      maxThres: product.maxThres,
      sourceWh: 1,
    });
  });
});