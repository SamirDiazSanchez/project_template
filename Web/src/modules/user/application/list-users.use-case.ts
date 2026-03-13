import type { UserRepository } from "../domain/repositories/user.repository.ts";

export class ListUsersUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(page: number, size: number) {
    return await this.userRepository.list(page, size);
  }
}
