import { describe, it, expect } from 'vitest';
import { UserId } from './userId.vo.js';

describe('Test userId value object', () => {
    it('should create a valid user id', () => {
        const userId = UserId.create();
        expect(userId).toBeInstanceOf(UserId);
    });

    it('should not set a invalid userId', () => {
        expect(() => new UserId('invalid')).toThrow('Invalid user id');
    });

    it('shoult set a userId without spaces', () => {
        const userId = new UserId('    2528f0cc-217e-4dc4-845b-f537fcdca64d    ');
        expect(userId.value).toBe('2528f0cc-217e-4dc4-845b-f537fcdca64d');
    });
});