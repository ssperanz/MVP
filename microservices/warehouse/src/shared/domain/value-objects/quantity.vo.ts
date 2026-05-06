export class Quantity {
    private readonly value: number;

    constructor(value: number){
        if (value < 0) {
            throw new Error('Quantity cannot be negative')
        }
        this.value = value
    }

    get getValue(): number {
        return this.value
    }

    isLessThan(other: Quantity): boolean {
        return this.value < other.getValue
    }

    isGreaterThan(other: Quantity): boolean {
        return this.value > other.getValue
    }

    isEqualTo(other: Quantity): boolean {
        return this.value === other.getValue
    }

    increaseBy(amount: Quantity): Quantity {
        return new Quantity(this.value + amount.getValue)
    }

    decreaseBy(amount: Quantity): Quantity {
        const newValue = this.value - amount.getValue
        if (newValue < 0) {
            throw new Error('Resulting quantity cannot be negative')
        }
        return new Quantity(newValue)
    }

}