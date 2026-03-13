export interface ICryptoService {
    encrypt(value: string): string;
    decrypt(encryptedValue: string): string;
}
