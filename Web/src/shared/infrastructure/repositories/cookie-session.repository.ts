import Cookies from 'js-cookie';
import type { SessionRepository } from '../../domain/repositories/session.repository';

export class CookieSessionRepository implements SessionRepository {
  set(key: string, value: string): void {
    Cookies.set(key, value, {
      expires: 1,
      sameSite: 'strict',
      secure: window.location.protocol === 'https:'
    });
  }

  get(key: string): string | null {
    const value = Cookies.get(key);
    return value || null;
  }

  remove(key: string): void {
    Cookies.remove(key);
  }

  clear(): void {
    Cookies.remove('user_role');
  }
}

