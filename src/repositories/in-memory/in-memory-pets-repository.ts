import { randomUUID } from "node:crypto";
import { Pet } from "../../../prisma/generated/prisma/client";
import { PetUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { FindManyPetsFilters, PetsRepository } from "../pets-repository";

export class InMemoryPetsRepository implements PetsRepository {
  public items: (Pet & {
    org?: {
      address?: {
        city?: string
      }
    }
  })[] = []

  async create(data: PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      type: data.type,
      ageGroup: data.ageGroup,
      size: data.size,
      energyLevel: data.energyLevel,
      independenceLevel: data.independenceLevel,
      environment: data.environment,
      adoptionRequirements: data.adoptionRequirements,
      createdAt: new Date(),
      org_id: data.org_id ?? null,
    }

    this.items.push(pet)

    return pet
  }

  async findById(id: string) {
    const pet = this.items.find(item => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async findMany({
    city,
    type,
    ageGroup,
    size,
    energyLevel,
    independenceLevel,
    environment,
  }: FindManyPetsFilters) {
    const pets = this.items.filter((item) => {
      if (item.org?.address?.city !== city) return false
      if (type && item.type !== type) return false
      if (ageGroup && item.ageGroup !== ageGroup) return false
      if (size && item.size !== size) return false
      if (energyLevel && item.energyLevel !== energyLevel) return false
      if (independenceLevel && item.independenceLevel !== independenceLevel) return false
      if (environment && item.environment !== environment) return false

      return true
    })

    return pets
  }
}
