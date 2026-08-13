import axios from 'axios';

describe('Warehouse → Warehouse Aggregator order synchronization', () => {
  const warehouseUrl = 'http://localhost:3000';
  const aggregatorUrl = 'http://localhost:3110';

  async function createOrder() {
    const order = {
      orderType: 'TRANSFER',
      items: [
        {
          productId: 'system-test-product-001',
          qty: 1,
        },
      ],
      departure: 1,
      destinationWh: 2,
    };

    const response = await axios.post(
      `${warehouseUrl}/orders`,
      order,
    );

    expect(response.status).toBe(201);

    const listResponse = await axios.get(
      `${warehouseUrl}/orders`,
    );

    expect(listResponse.status).toBe(200);

    const createdOrder =
      listResponse.data[listResponse.data.length - 1];

    expect(createdOrder).toBeDefined();

    return {
      ...order,
      orderId: createdOrder.orderId,
    };
  }

  async function waitForOrder(
    orderId: string,
    url: string,
    timeout = 5000,
  ): Promise<any> {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      try {
        const response = await axios.get(
          `${url}/orders/${orderId}`,
        );

        if (response.data) {
          return response.data;
        }
      } catch {
        // Order not available yet
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw new Error(
      `Order ${orderId} was not available within ${timeout}ms`,
    );
  }

  it('should successfully create an order in the warehouse', async () => {
    await createOrder();

    const response = await axios.get(
      `${warehouseUrl}/orders`,
    );

    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);

    const createdOrder =
      response.data[response.data.length - 1];

    expect(createdOrder).toBeDefined();
    expect(createdOrder.orderType).toBe('TRANSFER');
    expect(createdOrder.orderState).toBe('CREATED');
  });

  it('should retrieve a created order from the warehouse', async () => {
    const order = await createOrder();

    const listResponse = await axios.get(
      `${warehouseUrl}/orders`,
    );

    const createdOrder =
      listResponse.data[listResponse.data.length - 1];

    expect(createdOrder).toBeDefined();

    const getResponse = await axios.get(
      `${warehouseUrl}/orders/${createdOrder.orderId}`,
    );

    expect(getResponse.status).toBe(200);

    expect(getResponse.data).toMatchObject({
      orderId: createdOrder.orderId,
      orderType: order.orderType,
      departureWh: order.departure,
      destinationWh: order.destinationWh,
    });
  });

  it('should synchronize a created order with the aggregator', async () => {
    const order = await createOrder();

    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await axios.get(
      `${aggregatorUrl}/orders/${order.orderId}`,
    );

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      orderId: order.orderId,
      orderType: order.orderType,
      departureWh: order.departure,
      destinationWh: order.destinationWh,
      sourceWh: 1,
    });
  });
});