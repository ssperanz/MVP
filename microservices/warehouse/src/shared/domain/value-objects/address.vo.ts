export class Address {
  constructor(
    private readonly streetName: string,
    private readonly civicNumber: number,
    private readonly city: string,
    private readonly cap: string,
    private readonly country: string,
  ) {}

  getAddress(): string {
    return `${this.streetName} ${this.civicNumber}, ${this.cap} ${this.city}, ${this.country}`;
  }

  getStreetName(): string {
    return this.streetName;
  }

  getCivicNumber(): number {
    return this.civicNumber;
  }

  getCity(): string {
    return this.city;
  }

  getCap(): string {
    return this.cap;
  }

  getCountry(): string {
    return this.country;
  }
}
