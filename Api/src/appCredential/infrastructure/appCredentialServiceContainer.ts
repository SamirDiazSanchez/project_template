import { SqlServerAppCredentialRepository } from "./repositories/sqlServerAppCredential.repository.js";
import { SaveAppCredential } from "../application/use-case/saveAppCredential.uc.js";
import { ListAppCredentials } from "../application/use-case/listAppCredentials.uc.js";
import { RemoveAppCredential } from "../application/use-case/removeAppCredential.uc.js";

const appRepository = new SqlServerAppCredentialRepository();

export const AppCredentialServiceContainer = {
    save: new SaveAppCredential(appRepository),
    list: new ListAppCredentials(appRepository),
    remove: new RemoveAppCredential(appRepository)
};
