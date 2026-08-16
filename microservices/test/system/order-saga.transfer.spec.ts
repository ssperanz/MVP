import axios from 'axios';

describe('Transfer Order Saga - System Test', () => {
  const warehouse1Url = 'http://localhost:3000';
  const warehouse2Url = 'http://localhost:3001';
  const productId = `system-test-product-${Date.now()}`;

  jest.setTimeout(30_000);

  it('should complete the TransferOrder saga until DELIVERED', async () => {
    
    // --------------------------------------------------
    // 0. Initialize product
    // --------------------------------------------------

    const productsResponse = await axios.get(`${warehouse1Url}/products`);

    const products = productsResponse.data.products ?? productsResponse.data;

    const existingProduct = products.find(
      (product: any) => product.id === productId,
    );

    if (!existingProduct) {
      await axios.post(`${warehouse1Url}/products`, {
        id: productId,
        name: 'System Test Product',
        unitPrice: 100,
        availableQuantity: 10,
        minThres: 0,
        maxThres: 100,
      });
    } else {
      await axios.put(`${warehouse1Url}/products/${productId}`, {
        availableQuantity: 10,
      });
    }

    const productsResponse2 = await axios.get(`${warehouse2Url}/products`);

    const products2 = productsResponse2.data.products ?? productsResponse2.data;

    const existingProduct2 = products2.find(
      (product: any) => product.id === productId,
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
    // 1. Get existing orders BEFORE creating the order
    // --------------------------------------------------

    const beforeResponse = await axios.get(`${warehouse1Url}/orders`);
    const ordersBefore = beforeResponse.data;

    const orderIdsBefore = new Set(
      ordersBefore.map((order: any) => order.orderId ?? order.id),
    );

    // --------------------------------------------------
    // 2. Create SellOrder
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
    // 3. Find the newly created order
    // --------------------------------------------------

    let order: any | undefined;

    const deadline = Date.now() + 10_000;

    while (Date.now() < deadline) {
      const response = await axios.get(`${warehouse1Url}/orders`);
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
      const response = await axios.get(`${warehouse1Url}/orders/${orderId}`);

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
    expect(finalOrder.orderType).toBe('TRANSFER');
    expect(finalOrder.orderState).toBe('DELIVERED');

    // --------------------------------------------------
    // 6. Verify product was dispatched
    // --------------------------------------------------

    const productResponse1 = await axios.get(
      `${warehouse1Url}/products/${productId}`,
    );

    expect(productResponse1.data.availableQty).toBe(9);
    expect(productResponse1.data.reservedQty).toBe(0);

    // --------------------------------------------------
    // 6. Verify product was delivered to the destination warehouse
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
      await axios.delete(`${warehouse2Url}/products/${productId}`);
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
