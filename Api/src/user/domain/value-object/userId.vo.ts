export class UserId {
    constructor(public value: string) {
        const sanitizedValue = this.sanitize(value);
        if (!this.validate(sanitizedValue)) {
            throw new Error('Invalid user id');
        }
        this.value = sanitizedValue;
    }

    public static create(): UserId {
        return new UserId(crypto.randomUUID());
    }

    private sanitize(value: string): string {
        return value.trim();
    }

    private validate(value: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }
}
