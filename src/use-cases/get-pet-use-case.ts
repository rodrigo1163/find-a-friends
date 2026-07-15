import type { PetsRepository } from "@/repositories/pets-repository";
import type { Pet } from "../../prisma/generated/prisma/client";

export class GetPetUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}

  async execute(id: string): Promise<Pet | null> {
    return this.petsRepository.findById(id);
  }
}