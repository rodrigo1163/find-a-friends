import { compare } from 'bcryptjs'
import type { Org } from '../../prisma/generated/prisma/client'
import type { OrgsRepository } from '../repositories/orgs-repository'
import { InvalidCredentialsError } from './erros/invalid-credentials-error\''

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  org: Org
}

export class AuthenticateUseCase {
  constructor(private orgRepository: OrgsRepository) { }

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const org = await this.orgRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doesPassowrdMatches = await compare(password, org.password_hash)

    if (!doesPassowrdMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      org,
    }
  }
}
