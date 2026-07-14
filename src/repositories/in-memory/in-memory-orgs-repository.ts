import { randomUUID } from "node:crypto";
import { Org } from "../../../prisma/generated/prisma/client";
import { OrgCreateInput } from "../../../prisma/generated/prisma/models";
import { OrgsRepository } from "../orgs-repository";

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []
  async create(data: OrgCreateInput) {
    const org: Org = {
      id: randomUUID(),
      phone: data.phone,
      email: data.email,
      password_hash: data.password_hash,
      createdAt: new Date(),
      name: data.name,
    }
    this.items.push(org)

    return org
  }
  async findByEmail(email: string) {
    const org = this.items.find(item => item.email === email)

    if (!org) {
      return null
    }

    return org
  }
}