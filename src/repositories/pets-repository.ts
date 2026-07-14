import type { Pet } from "../../prisma/generated/prisma/client";
import type { PetUncheckedCreateInput } from "../../prisma/generated/prisma/models";

export interface PetsRepository {
  create(data: PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
}
