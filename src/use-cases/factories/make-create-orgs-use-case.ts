import { PrismaAddressOrgsRepository } from "@/repositories/prisma/prisma-address-orgs-repository"
import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository"
import { CreateOrgUseCase } from "../create-org-use-case"

export function makeCreateOrgsUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const addressOrgsRepository = new PrismaAddressOrgsRepository()
  const createOrgUseCase = new CreateOrgUseCase(orgsRepository, addressOrgsRepository)

  return createOrgUseCase
}