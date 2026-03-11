export class UserRole {
    private readonly VALID_ROLES = ["admin", "user"];

    constructor(public value: string) {
        const sanitizedValue = this.sanitize(value);
        if (!this.validate(sanitizedValue)) throw new Error("Invalid user role");
        this.value = sanitizedValue;
    }

    private validate(value: string): boolean {
        if (!value) return false;
        if (!this.VALID_ROLES.includes(value)) return false;
        return true;
    }

    private sanitize(value: string): string {
        return value.trim().toLowerCase();
    }
}