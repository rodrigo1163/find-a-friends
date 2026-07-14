import { AddressOrg } from "../../prisma/generated/prisma/client";
import { AddressOrgUncheckedCreateInput } from "../../prisma/generated/prisma/models";

export interface AddressOrgsRepository {
  create(data: AddressOrgUncheckedCreateInput): Promise<AddressOrg>
}