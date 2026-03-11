import { SqliteUserRepository } from "@/user/infrastructure/repositories/sqliteUser.repository.js";
import { JwtService } from "./services/jwt.service.js";
import { AuthLogin } from "../application/use-case/authLogin.uc.js";
import { AuthRefresh } from "../application/use-case/authRefresh.uc.js";

const userRepository = new SqliteUserRepository();
const jwtService = new JwtService();

export const AuthServiceContainer = {
    login: new AuthLogin(userRepository, jwtService),
    refresh: new AuthRefresh(jwtService),
};
