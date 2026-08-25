import axios from 'axios';

describe('Sell Order Saga - System Test', () => {
  const warehouseUrl = 'http://localhost:3000';
  const productId = `system-test-product-${Date.now()}`;

  jest.setTimeout(30_000);

  it('should complete the SellOrder saga until DELIVERED', async () => {
    // --------------------------------------------------
    // 0. Initialize product
    // --------------------------------------------------

    await axios.post(`${warehouseUrl}/products`, {
      id: productId,
      name: 'System Test Product',
      unitPrice: 100,
      availableQuantity: 10,
      minThres: 1,
      maxThres: 100,
    });

    // --------------------------------------------------
    // 1. Create SellOrder
    // --------------------------------------------------

    await axios.post(`${warehouseUrl}/orders`, {
      orderType: 'SELL',
      items: [
        {
          productId,
          qty: 1,
        },
      ],
      departure: 1,
      destinationAddress: {
        streetName: 'Via Roma',
        civicNumber: 10,
        city: 'Milano',
        cap: '20100',
        country: 'Italy',
      },
    });

    // --------------------------------------------------
    // 2. Find the order created by this test
    // --------------------------------------------------

    const orderDeadline = Date.now() + 10_000;

    let createdOrder: any | undefined;

    while (Date.now() < orderDeadline) {
      const response = await axios.get(`${warehouseUrl}/orders`);

      createdOrder = response.data.find(
        (candidate: any) =>
          candidate.orderType === 'SELL' &&
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
          `${warehouseUrl}/orders/${orderId}`,
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
    expect(finalOrder.orderId ?? finalOrder.id).toBe(orderId);
    expect(finalOrder.orderType).toBe('SELL');
    expect(finalOrder.orderState).toBe('DELIVERED');

    // --------------------------------------------------
    // 5. Verify product was dispatched
    // --------------------------------------------------

    const productResponse = await axios.get(
      `${warehouseUrl}/products/${productId}`,
    );

    expect(productResponse.data.availableQty).toBe(9);
    expect(productResponse.data.reservedQty).toBe(0);
  });

  afterAll(async () => {
    try {
      await axios.delete(`${warehouseUrl}/products/${productId}`);
    } catch (error) {
      // The product may not have been created or may
      // already have been removed.
      if (
        !axios.isAxiosError(error) ||
        error.response?.status !== 404
      ) {
        throw error;
      }
    }
  });
});
