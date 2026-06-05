import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderCommand } from './use-cases/command/create-order.command';
import { CancelOrderCommand } from './use-cases/command/cancel-order.command';
import { OrderIdDto } from './dto/order-id.dto';
import { DeliverOrderCommand } from './use-cases/command/deliver-order.command';
import { OrderDispatchedDto } from './dto/order-dispatched.dto';
import { Injectable } from '@nestjs/common';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo';
import { UpdateOrderStateDto } from './dto/update-order-state.dto';
import { UpdateOrderStateCommand } from './use-cases/command/update-order-state.command';
import { OrderState } from 'src/shared/domain/enums/order-state.enum';
import { OrderCommandUseCase } from './use-cases/order.usecase.command';

@Injectable()
export class OrderService implements OrderCommandUseCase {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

    async createOrder(dto: CreateOrderDto): Promise<void> {
      let dest: number | { streetName: string; civicNumber: number; city: string; cap: string; country: string; };
      if (dto.destinationWh) {
        dest = dto.destinationWh;
      } else if (dto.destinationAddress) {
        dest = dto.destinationAddress;
      } else {
        throw new Error('Either destinationWh or destinationAddress must be provided');
      }
      const command = new CreateOrderCommand(
        dto.orderType,
        dto.items,
        dto.departure ?? null,
        dest,
        dto.orderReference ?? null,
      );
      return this.commandBus.execute(command);
    }

    async cancelOrder(dto: OrderIdDto): Promise<void> {
      return this.commandBus.execute(new CancelOrderCommand(new OrderId(dto.orderId)));
    }

    async deliverOrder(dto: OrderDispatchedDto): Promise<void> {
      return this.commandBus.execute(new DeliverOrderCommand(new OrderId(dto.orderId)));
    }

    async updateOrderStatus(dto: UpdateOrderStateDto): Promise<void> {
      return this.commandBus.execute(new UpdateOrderStateCommand(new OrderId(dto.orderId), dto.newState as OrderState));
    }
  }