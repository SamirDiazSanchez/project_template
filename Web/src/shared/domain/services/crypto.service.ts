export interface CryptoService {
  encrypt(value: string): string;
  decrypt(encryptedValue: string): string;
}
