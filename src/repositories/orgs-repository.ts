import { Org } from "../../prisma/generated/prisma/client";
import { OrgCreateInput } from "../../prisma/generated/prisma/models";

export interface OrgsRepository {
  create(data: OrgCreateInput): Promise<Org>
  findByEmail(email: string): Promise<Org | null>
}