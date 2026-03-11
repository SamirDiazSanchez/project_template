export interface IJwtService {
    sign(payload: object, expiresIn?: string | number): string;
    signRefresh(payload: object, expiresIn?: string | number): string;
    verify(token: string): object | null;
    verifyRefresh(token: string): object | null;
}
