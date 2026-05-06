export class ProductId {
    private readonly productId: string;

    constructor(id: string) {
        if(!id || id.trim().length === 0) {
            throw new Error('ProductId cannot be empty');
        }
        this.productId = id;
    }

    get id(): string {
        return this.productId;
    }
}