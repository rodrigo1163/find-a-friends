import type { FindManyPetsFilters, PetsRepository } from "@/repositories/pets-repository";
import type { Pet } from "../../prisma/generated/prisma/client";

export class FetchPetsUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}

  async execute(filters: FindManyPetsFilters): Promise<Pet[]> {
    return this.petsRepository.findMany(filters);
  }
}
