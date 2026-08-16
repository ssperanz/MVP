import axios from 'axios';

describe('Sell Order Saga - System Test', () => {
  const warehouseUrl = 'http://localhost:3000';
  const productId = `system-test-product-${Date.now()}`;

  jest.setTimeout(30_000);

  it('should complete the SellOrder saga until DELIVERED', async () => {
    
    // --------------------------------------------------
    // 0. Initialize product
    // --------------------------------------------------

    const productsResponse = await axios.get(`${warehouseUrl}/products`);

    const products = productsResponse.data.products ?? productsResponse.data;

    const existingProduct = products.find(
      (product: any) => product.id === productId,
    );

    if (!existingProduct) {
      await axios.post(`${warehouseUrl}/products`, {
        id: productId,
        name: 'System Test Product',
        unitPrice: 100,
        availableQuantity: 10,
        minThres: 1,
        maxThres: 100,
      });
    } else {
      await axios.put(`${warehouseUrl}/products/${productId}`, {
        availableQuantity: 10,
      });
    }

    // --------------------------------------------------
    // 1. Get existing orders BEFORE creating the order
    // --------------------------------------------------

    const beforeResponse = await axios.get(`${warehouseUrl}/orders`);
    const ordersBefore = beforeResponse.data;

    const orderIdsBefore = new Set(
      ordersBefore.map((order: any) => order.orderId ?? order.id),
    );

    // --------------------------------------------------
    // 2. Create SellOrder
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
    // 3. Find the newly created order
    // --------------------------------------------------

    let order: any | undefined;

    const deadline = Date.now() + 10_000;

    while (Date.now() < deadline) {
      const response = await axios.get(`${warehouseUrl}/orders`);
      const ordersAfter = response.data;

      order = ordersAfter.find(
        (candidate: any) =>
          !orderIdsBefore.has(candidate.orderId ?? candidate.id),
      );

      if (order) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    expect(order).toBeDefined();

    const orderId = order.orderId ?? order.id;

    expect(orderId).toBeDefined();

    // --------------------------------------------------
    // 4. Wait for the Saga to complete
    // --------------------------------------------------

    const sagaDeadline = Date.now() + 15_000;

    let finalOrder: any | undefined;

    while (Date.now() < sagaDeadline) {
      const response = await axios.get(`${warehouseUrl}/orders/${orderId}`);

      finalOrder = response.data;

      if (finalOrder?.orderState === 'DELIVERED') {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // --------------------------------------------------
    // 5. Verify final state
    // --------------------------------------------------

    expect(finalOrder).toBeDefined();
    expect(finalOrder.orderId).toBe(orderId);
    expect(finalOrder.orderType).toBe('SELL');
    expect(finalOrder.orderState).toBe('DELIVERED');

    // --------------------------------------------------
    // 6. Verify product was dispatched
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
      // Il prodotto potrebbe non essere mai stato creato
      // oppure essere già stato rimosso.
      if (
        !axios.isAxiosError(error) ||
        error.response?.status !== 404
      ) {
        throw error;
      }
    }
  });
});
