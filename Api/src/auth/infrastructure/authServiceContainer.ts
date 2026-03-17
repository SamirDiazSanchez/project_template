import { JwtService } from "./services/jwt.service.js";
import { AuthLogin } from "../application/use-case/authLogin.uc.js";
import { AuthRefresh } from "../application/use-case/authRefresh.uc.js";
import { AuthGoogleLogin } from "../application/use-case/authGoogleLogin.uc.js";
import { AuthLogout } from "../application/use-case/authLogout.uc.js";
import { AuthOAuthLogin } from "../application/use-case/authOAuthLogin.uc.js";
import { SqlServerUserRepository } from "@/user/infrastructure/repositories/sqlServerUser.repository.js";
import { SqlServerSessionRepository } from "./repositories/sqlServerSession.repository.js";
import { SqlServerAppCredentialRepository } from "../../appCredential/infrastructure/repositories/sqlServerAppCredential.repository.js";

const userRepository = new SqlServerUserRepository();
const sessionRepository = new SqlServerSessionRepository();
const appRepository = new SqlServerAppCredentialRepository();
const jwtService = new JwtService();

export const AuthServiceContainer = {
    login: new AuthLogin(userRepository, jwtService, sessionRepository),
    refresh: new AuthRefresh(jwtService, sessionRepository),
    googleLogin: new AuthGoogleLogin(userRepository, jwtService, sessionRepository),
    logout: new AuthLogout(jwtService, sessionRepository),
    oauthLogin: new AuthOAuthLogin(appRepository, jwtService),
};
