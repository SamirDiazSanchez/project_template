import CryptoJS from "crypto-js";
import type { ICryptoService } from "../../domain/services/crypto.service.interface.js";

export class AESCryptoService implements ICryptoService {
    private readonly secretKey: string;

    constructor() {
        this.secretKey = process.env.VITE_CRYPTO_KEY!;
    }

    encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, this.secretKey).toString();
    }

    decrypt(encryptedValue: string): string {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch {
            return "";
        }
    }
}
