import { Session } from "../entities/session.entity.js";

export interface ISessionRepository {
    save(session: Session): Promise<void>;
    findByUserId(userId: string): Promise<Session | null>;
    remove(userId: string): Promise<void>;
}
