export class UserEmail {
    constructor(public readonly value: string) {
        const sanitizedEmail = this.sanitize(value);
        this.validate(sanitizedEmail);
        this.value = sanitizedEmail;
    }

    private validate(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email');
        }
    }

    private sanitize(email: string): string {
        return email.trim();
    }
}