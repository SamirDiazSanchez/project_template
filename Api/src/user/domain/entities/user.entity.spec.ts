import { describe, it, expect } from 'vitest';
import { UserId } from '../value-object/userId.vo.js';
import { UserEmail } from '../value-object/userEmail.vo.js';
import { User } from './user.entity.js';
import { UserRole } from '../value-object/userRole.vo.js';

describe('Test user entity', () => {
    it('should create a new user', () => {
        const userId = UserId.create();
        const userEmail = new UserEmail('mail@mail.com');
        const userRole = new UserRole('admin');
        const user = new User(userId, userEmail, 'name', userRole);
        expect(user).toBeInstanceOf(User);
        expect(user.userId).toBe(userId);
        expect(user.email).toBe(userEmail);
        expect(user.role).toBe(userRole);
        expect(user.userName).toBe('name');
    });

    it('should change the name of the user', () => {
        const userId = UserId.create();
        const userEmail = new UserEmail('mail@mail.com');
        const userRole = new UserRole('admin');
        const user = new User(userId, userEmail, 'name', userRole);
        user.userName = 'new name';
        expect(user.userName).toBe('new name');
    });

    it('should change the role of the user', () => {
        const userId = UserId.create();
        const userEmail = new UserEmail('mail@mail.com');
        const userRole = new UserRole('admin');
        const user = new User(userId, userEmail, 'name', userRole);
        user.role = new UserRole('user');
        expect(user.role).toBe(new UserRole('user'));
    });

    it('should set recordId to user', () => {
        const userId = UserId.create();
        const userEmail = new UserEmail('mail@mail.com');
        const userRole = new UserRole('admin');
        const user = new User(userId, userEmail, 'name', userRole);

        const recorderId = UserId.create();

        user.setRecordId(recorderId);
        expect(user.recorderId).toBe(recorderId);
    });

    it('should set isActive to user', () => {
        const userId = UserId.create();
        const userEmail = new UserEmail('mail@mail.com');
        const userRole = new UserRole('admin');
        const user = new User(userId, userEmail, 'name', userRole);

        user.setIsActive(true);
        expect(user.isActive).toBe(true);
    });
});