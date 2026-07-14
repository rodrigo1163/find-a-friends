import { prisma } from "../../../lib/prisma";
import { OrgCreateInput } from "../../../prisma/generated/prisma/models";
import { OrgsRepository } from "../orgs-repository";


export class PrismaOrgsRepository implements OrgsRepository {
  async findByEmail(email: string) {
    const org = await prisma.org.findUnique({
      where: {
        email
      }
    })

    if (!org) {
      return null
    }

    return org
  }

  async create(data: OrgCreateInput) {
    const orgs = await prisma.org.create({
      data
    })

    return orgs
  }
}
