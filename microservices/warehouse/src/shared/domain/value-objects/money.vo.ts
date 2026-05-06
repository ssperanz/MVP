import { Quantity } from './quantity.vo.js';

export class Money {
  private readonly amount: number;

  constructor(amount: number) {
    if (amount < 0) throw new Error('Money amount cannot be negative');
    this.amount = amount;
  }

  getAmount(): number {
    return this.amount;
  }

  increaseBy(other: Money): Money {
    return new Money(this.amount + other.getAmount());
  }

  decreaseBy(other: Money): Money {
    return new Money(this.amount - other.getAmount());
  }

  multiplyBy(qty: Quantity): Money {
    return new Money(this.amount * qty.getValue);
  }

  isLessThan(other: Money): boolean {
    return this.amount < other.getAmount();
  }

  isGreaterThan(other: Money): boolean {
    return this.amount > other.getAmount();
  }

  isEqualTo(other: Money): boolean {
    return this.amount === other.getAmount();
  }
}
