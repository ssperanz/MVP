import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ProductCriticalEventPublisher } from "src/core/application/product/ports/product-critical-event-publisher.port";
import { ProductCriticalEventPublisherNats } from "./product-critical-event.publisher.nats";

describe('ProductCriticalEventPublisherNats', () => {
  let productCriticalEventPublisherNats: ProductCriticalEventPublisherNats;
  let natsClientMock: ClientProxy;

  beforeEach(() => {
    natsClientMock = {
      emit: jest.fn().mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(undefined),
      }),
    } as unknown as ClientProxy;

    productCriticalEventPublisherNats = new ProductCriticalEventPublisherNats(natsClientMock);
  });

  it('should publish critical min threshold event with correct subject and payload', async () => {
    const productId = 'prod123';
    const minThres = 10;
    const currentQty = 5;

    await productCriticalEventPublisherNats.publishCriticalMinThresEvent(productId, minThres, currentQty);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.critical.minThres`,
      { productId, minThres, currentQty }
    );
  });

  it('should publish critical max threshold event with correct subject and payload', async () => {
    const productId = 'prod123';
    const maxThres = 100;
    const currentQty = 105;

    await productCriticalEventPublisherNats.publishCriticalMaxThresEvent(productId, maxThres, currentQty);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.critical.maxThres`,
      { productId, maxThres, currentQty }
    );
  });
});