export class OrderId {
  private readonly id: string;

  constructor(id: string) {
    if (!id || id.trim().length === 0)
      throw new Error('OrderId cannot be empty');
    this.id = id;
  }

  getId(): string {
    return this.id;
  }
}
