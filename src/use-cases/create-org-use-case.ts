import { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgsAlreadyExistsError } from './erros/orgs-already-exists-error'
import { AddressOrgsRepository } from '@/repositories/address-orgs-repository'
import { hash } from 'bcryptjs'

import type { Org as OrgResponse } from '../../prisma/generated/prisma/client'

interface Org {
  name: string
  email: string
  phone: string
  password: string
}

interface AddressOrg {
  cep: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  complement?: string | null
  reference?: string | null
  country?: string
  latitude: number
  longitude: number
}

interface CreateOrgUseCaseProps {
  org: Org
  addressOrg: AddressOrg
}

interface CreateOrgUseCaseResponse {
  org: OrgResponse
}

// SOLID
// D - Denpendency Inversion Principle
export class CreateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository, private addressOrgsRepository: AddressOrgsRepository) { }

  async execute({ org, addressOrg }: CreateOrgUseCaseProps): Promise<CreateOrgUseCaseResponse> {
    const { email, name, password, phone } = org
    const { cep, city, latitude, longitude, neighborhood, number, state, street, complement, country, reference } = addressOrg

    const orgExist = await this.orgsRepository.findByEmail(org.email)

    if (orgExist) {
      throw new OrgsAlreadyExistsError()
    }

    const password_hash = await hash(password, 8)

    const createdOrg = await this.orgsRepository.create({
      email,
      name,
      password_hash,
      phone,
    })

    await this.addressOrgsRepository.create({
      cep,
      city,
      latitude,
      longitude,
      neighborhood,
      number,
      org_id: createdOrg.id,
      state,
      street,
      complement,
      country,
      reference
    })

    return {
      org: createdOrg,
    }
  }
}
