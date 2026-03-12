import { JwtService } from "./services/jwt.service.js";
import { AuthLogin } from "../application/use-case/authLogin.uc.js";
import { AuthRefresh } from "../application/use-case/authRefresh.uc.js";
import { SqlServerUserRepository } from "@/user/infrastructure/repositories/sqlServerUser.repository.js";

const userRepository = new SqlServerUserRepository();
const jwtService = new JwtService();

export const AuthServiceContainer = {
    login: new AuthLogin(userRepository, jwtService),
    refresh: new AuthRefresh(jwtService),
};
