import type { UserRepository } from "../domain/repositories/user.repository.ts";

export class DeleteUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string) {
    return await this.userRepository.delete(id);
  }
}
