import Cookies from 'js-cookie';
import type { SessionRepository } from '../../domain/repositories/session.repository';
import type { CryptoService } from '../../domain/services/crypto.service';
import { cryptoService } from '../services/aes-crypto.service';

export class CookieSessionRepository implements SessionRepository {
  private readonly cryptoService: CryptoService;

  constructor() {
    this.cryptoService = cryptoService;
  }

  set(key: string, value: string): void {
    const encryptedValue = this.cryptoService.encrypt(value);
    Cookies.set(key, encryptedValue, {
      expires: 1,
      sameSite: 'strict',
      secure: window.location.protocol === 'https:'
    });
  }

  get(key: string): string | null {
    const encryptedValue = Cookies.get(key);
    if (!encryptedValue) return null;

    try {
      const decryptedValue = this.cryptoService.decrypt(encryptedValue);
      return decryptedValue || null;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    Cookies.remove(key);
  }

  clear(): void {
    // In a generic repo, clear might need to know all keys. 
    // For now, we'll remove common session keys or the user can implement a prefix system.
    Cookies.remove('user_role');
  }
}
