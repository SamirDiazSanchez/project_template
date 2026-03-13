import type { UserRepository } from "../domain/repositories/user.repository.ts";

export class SaveUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string | null, name: string, email: string, role: string) {
    return await this.userRepository.save(userId, name, email, role);
  }
}
