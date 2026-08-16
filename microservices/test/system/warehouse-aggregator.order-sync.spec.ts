import axios from 'axios';

describe('Warehouse → Warehouse Aggregator order synchronization', () => {
  const warehouseUrl = 'http://localhost:3000';
  const aggregatorUrl = 'http://localhost:3110';
  const productId = `system-test-product-${Date.now()}`;


  async function createOrder() {
    const order = {
      orderType: 'TRANSFER',
      items: [
        {
          productId: productId,
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