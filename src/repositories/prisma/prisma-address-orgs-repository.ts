import { prisma } from "../../../lib/prisma";
import { AddressOrgUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { AddressOrgsRepository } from "../address-orgs-repository";


export class PrismaAddressOrgsRepository implements AddressOrgsRepository {
  async create(data: AddressOrgUncheckedCreateInput) {
    const addressOrg = await prisma.addressOrg.create({
      data
    })

    return addressOrg
  }
}
