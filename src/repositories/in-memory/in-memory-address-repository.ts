import { randomUUID } from "node:crypto";
import { AddressOrg, Prisma } from "../../../prisma/generated/prisma/client";
import { AddressOrgUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { AddressOrgsRepository } from "../address-orgs-repository";

export class InMemoryAddressOrgsRepository implements AddressOrgsRepository {
  public items: AddressOrg[] = []

  async create(data: AddressOrgUncheckedCreateInput) {
    const addressOrg: AddressOrg = {
      id: data.id ?? randomUUID(),
      org_id: data.org_id,
      cep: data.cep,
      street: data.street,
      number: data.number,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      complement: data.complement ?? null,
      reference: data.reference ?? null,
      country: data.country ?? "Brasil",
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.items.push(addressOrg)

    return addressOrg
  }
}
