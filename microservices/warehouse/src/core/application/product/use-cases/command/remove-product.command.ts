import { Command } from "@nestjs/cqrs"

export class RemoveProductCommand extends Command<void> {
    constructor(public readonly id: string) {
        super();
    }
}