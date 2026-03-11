import { describe, it, expect } from 'vitest';
import { UserEmail } from './userEmail.vo.js';

describe('Test userEmail value object', () => {
    it('should thow error if email is invalid', () => {
        expect(() => new UserEmail('testexamplecom')).toThrow('Invalid email');
        expect(() => new UserEmail('test@examplecom')).toThrow('Invalid email');
    });

    it('should not create an invalid user email', () => {
        const userEmail = new UserEmail('test@example.com');
        expect(userEmail).toBeInstanceOf(UserEmail);
        expect(userEmail.value).toBe('test@example.com');
    });

    it('should set a valid email without spaces', () => {
        const userEmail = new UserEmail('   test@example.com   ');
        expect(userEmail.value).toBe('test@example.com');
    });
});