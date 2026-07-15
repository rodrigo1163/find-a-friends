import { prisma } from "../../../lib/prisma";
import type { Pet } from "../../../prisma/generated/prisma/client";
import { PetUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { FindManyPetsFilters, PetsRepository } from "../pets-repository";

export class PrismaPetsRepository implements PetsRepository {
  async create(data: PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data
    })

    return pet
  }

  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id
      }
    })

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
    const pets = await prisma.pet.findMany({
      where: {
        type,
        ageGroup,
        size,
        energyLevel,
        independenceLevel,
        environment,
        org: {
          address: {
            city,
          },
        },
      },
    })

    return pets
  }
}
