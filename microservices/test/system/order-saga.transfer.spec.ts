import axios from 'axios';

describe('Transfer Order Saga - System Test', () => {
  const warehouse1Url = 'http://localhost:3000';
  const warehouse2Url = 'http://localhost:3001';
  const productId = `system-test-product-${Date.now()}`;

  jest.setTimeout(30_000);

  it('should complete the TransferOrder saga until DELIVERED', async () => {
    // --------------------------------------------------
    // 0. Initialize product in source warehouse
    // --------------------------------------------------

    await axios.post(`${warehouse1Url}/products`, {
      id: productId,
      name: 'System Test Product',
      unitPrice: 100,
      availableQuantity: 10,
      minThres: 0,
      maxThres: 100,
    });

    // --------------------------------------------------
    // 0. Initialize product in destination warehouse
    // --------------------------------------------------

    const productsResponse2 = await axios.get(`${warehouse2Url}/products`);

    const products2 =
      productsResponse2.data.products ?? productsResponse2.data;

    const existingProduct2 = products2.find(
      (product: any) =>
        (product.productId ?? product.id) === productId,
    );

    if (!existingProduct2) {
      await axios.post(`${warehouse2Url}/products`, {
        id: productId,
        name: 'System Test Product',
        unitPrice: 100,
        availableQuantity: 0,
        minThres: 0,
        maxThres: 100,
      });
    } else {
      await axios.put(`${warehouse2Url}/products/${productId}`, {
        availableQuantity: 0,
      });
    }

    // --------------------------------------------------
    // 1. Create TransferOrder
    // --------------------------------------------------

    await axios.post(`${warehouse1Url}/orders`, {
      orderType: 'TRANSFER',
      items: [
        {
          productId,
          qty: 1,
        },
      ],
      departure: 1,
      destinationWh: 2,
    });

    // --------------------------------------------------
    // 2. Find the order created by this test
    // --------------------------------------------------
    //
    // productId is unique for this test, so it is used as
    // the correlation key instead of comparing order IDs
    // before and after creation.
    //

    const orderDeadline = Date.now() + 10_000;

    let createdOrder: any | undefined;

    while (Date.now() < orderDeadline) {
      const response = await axios.get(`${warehouse1Url}/orders`);

      createdOrder = response.data.find(
        (candidate: any) =>
          candidate.orderType === 'TRANSFER' &&
          candidate.orderItems?.some(
            (item: any) => item.productId === productId,
          ),
      );

      if (createdOrder) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    expect(createdOrder).toBeDefined();

    const orderId = createdOrder.orderId;

    expect(orderId).toBeDefined();

    // --------------------------------------------------
    // 3. Wait for the Saga to complete
    // --------------------------------------------------

    const sagaDeadline = Date.now() + 15_000;

    let finalOrder: any | undefined;

    while (Date.now() < sagaDeadline) {
      try {
        const response = await axios.get(
          `${warehouse1Url}/orders/${orderId}`,
        );

        finalOrder = response.data;

        if (finalOrder?.orderState === 'DELIVERED') {
          break;
        }
      } catch (error) {
        // The order may not be immediately available while
        // the asynchronous Saga is being initialized.
        if (
          !axios.isAxiosError(error) ||
          error.response?.status !== 404
        ) {
          throw error;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // --------------------------------------------------
    // 4. Verify final state
    // --------------------------------------------------

    expect(finalOrder).toBeDefined();
    expect(finalOrder.orderId).toBe(orderId);
    expect(finalOrder.orderType).toBe('TRANSFER');
    expect(finalOrder.orderState).toBe('DELIVERED');

    // --------------------------------------------------
    // 5. Verify product was dispatched from source warehouse
    // --------------------------------------------------

    const productResponse1 = await axios.get(
      `${warehouse1Url}/products/${productId}`,
    );

    expect(productResponse1.data.availableQty).toBe(9);
    expect(productResponse1.data.reservedQty).toBe(0);

    // --------------------------------------------------
    // 6. Verify product was delivered to destination warehouse
    // --------------------------------------------------

    const productResponse2 = await axios.get(
      `${warehouse2Url}/products/${productId}`,
    );

    expect(productResponse2.data.availableQty).toBe(1);
    expect(productResponse2.data.reservedQty).toBe(0);
  });

  afterAll(async () => {
    try {
      await axios.delete(`${warehouse1Url}/products/${productId}`);
    } catch (error) {
      if (
        !axios.isAxiosError(error) ||
        error.response?.status !== 404
      ) {
        throw error;
      }
    }

    try {
      await axios.delete(`${warehouse2Url}/products/${productId}`);
    } catch (error) {
      if (
        !axios.isAxiosError(error) ||
        error.response?.status !== 404
      ) {
        throw error;
      }
    }
  });
});
