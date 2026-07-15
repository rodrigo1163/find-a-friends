import type {
  Pet,
  PetType,
  PetAgeGroup,
  PetSize,
  PetEnergyLevel,
  PetIndependenceLevel,
  PetEnvironment,
} from "../../prisma/generated/prisma/client";
import type { PetUncheckedCreateInput } from "../../prisma/generated/prisma/models";

export interface FindManyPetsFilters {
  city: string
  type?: PetType
  ageGroup?: PetAgeGroup
  size?: PetSize
  energyLevel?: PetEnergyLevel
  independenceLevel?: PetIndependenceLevel
  environment?: PetEnvironment
}

export interface PetsRepository {
  create(data: PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  findMany(filters: FindManyPetsFilters): Promise<Pet[]>
}
