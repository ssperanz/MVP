import axios from 'axios';
import { connect, StringCodec } from 'nats';

describe('Warehouse → Warehouse Aggregator synchronization', () => {
  let connection: Awaited<ReturnType<typeof connect>>;
  const sc = StringCodec();

  const aggregatorUrl = 'http://localhost:3110';

  beforeAll(async () => {
    connection = await connect({
      servers: 'nats://localhost:4222',
    });
  });

  afterAll(async () => {
    await connection.drain();
  });

  async function waitForProduct(
    productId: string,
    predicate: (product: any) => boolean,
    timeout = 5000,
    interval = 100,
  ): Promise<void> {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      try {
        const response = await axios.get(
          `${aggregatorUrl}/products/${productId}`,
        );

        const product = response.data?.find(
          (product: any) => product.productId === productId,
        );

        if (product && predicate(product)) {
          return;
        }
      } catch {
        // Aggregator might not have processed the event yet.
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(
      `Product ${productId} did not reach the expected state within ${timeout}ms`,
    );
  }

  it('should synchronize ProductCreatedEvent with the aggregator', async () => {
    const payload = {
      productId: 'system-test-product-001',
      name: 'System Test Product',
      unitPrice: 10,
      availableQty: 100,
      reservedQty: 0,
      minThres: 10,
      maxThres: 200,
    };

    connection.publish(
      'warehouse.1.product.created',
      sc.encode(JSON.stringify(payload)),
    );

    await connection.flush();

    await waitForProduct(
      payload.productId,
      (product) =>
        product.name === payload.name &&
        product.unitPrice === payload.unitPrice &&
        product.availableQty === payload.availableQty &&
        product.reservedQty === payload.reservedQty &&
        product.minThres === payload.minThres &&
        product.maxThres === payload.maxThres &&
        product.sourceWh === 1,
    );
  });

  it('should synchronize ProductNameUpdatedEvent with the aggregator', async () => {
    const productId = 'system-test-product-name-001';

    const createPayload = {
      productId,
      name: 'Original Product Name',
      unitPrice: 10,
      availableQty: 100,
      reservedQty: 0,
      minThres: 10,
      maxThres: 200,
    };

    connection.publish(
      'warehouse.1.product.created',
      sc.encode(JSON.stringify(createPayload)),
    );

    await connection.flush();
    
    await waitForProduct(
      productId,
      (product) => product.name === 'Original Product Name',
    );
    
    connection.publish(
      'warehouse.1.product.name.updated',
      sc.encode(
        JSON.stringify({
          productId,
          name: 'Updated Product Name',
        }),
      ),
    );

    await connection.flush();
    
    await waitForProduct(
      productId,
      (product) => product.name === 'Updated Product Name',
    );
  });

});