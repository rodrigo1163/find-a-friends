import { prisma } from "../../../lib/prisma";
import { PetUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { PetsRepository } from "../pets-repository";

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
}
