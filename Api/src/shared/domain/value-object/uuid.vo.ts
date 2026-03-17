import { randomUUID } from "node:crypto";

export class Uuid {
    constructor(public value: string) {
        const sanitizedValue = this.sanitize(value);
        if (!this.validate(sanitizedValue)) {
            throw new Error('Invalid uuid');
        }
        this.value = sanitizedValue;
    }

    public static create(): Uuid {
        return new Uuid(randomUUID());
    }

    private sanitize(value: string): string {
        return value.trim();
    }

    private validate(value: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }
}
