import CryptoJS from 'crypto-js';
import type { CryptoService } from '../../domain/services/crypto.service';

export class AESCryptoService implements CryptoService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = import.meta.env.VITE_CRYPTO_KEY!;
  }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(encryptedValue: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
  }
}

export const cryptoService = new AESCryptoService();
