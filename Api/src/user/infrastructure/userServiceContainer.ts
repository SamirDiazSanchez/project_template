import { UserFindByEmail } from "../application/use-case/userFindByEmail.uc.js";
import { UserFindById } from "../application/use-case/userFindById.uc.js";
import { UserListAll } from "../application/use-case/userListAll.us.js";
import { UserRemove } from "../application/use-case/userRemove.uc.js";
import { UserSave } from "../application/use-case/userSave.uc.js";
import { SqlServerUserRepository } from "./repositories/sqlServerUser.repository.js";

const userRepository = new SqlServerUserRepository();

export const UserServiceContainer = {
    listAll: new UserListAll(userRepository),
    findById: new UserFindById(userRepository),
    findByEmail: new UserFindByEmail(userRepository),
    remove: new UserRemove(userRepository),
    save: new UserSave(userRepository),
}