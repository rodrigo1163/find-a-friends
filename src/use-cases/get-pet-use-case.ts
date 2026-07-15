import type { PetsRepository } from "@/repositories/pets-repository";
import type { Pet } from "../../prisma/generated/prisma/client";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";

export class GetPetUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}

  async execute(id: string): Promise<Pet | null> {
    const pet = await this.petsRepository.findById(id);
    if (!pet) {
      throw new ResourceNotFoundError()
    }
    return pet;
  }
}