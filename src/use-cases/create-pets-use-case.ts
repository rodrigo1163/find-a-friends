import type { Pet as PetResponse } from '../../prisma/generated/prisma/client'
import { PetsRepository } from '@/repositories/pets-repository'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

type CreatePetType = 'DOG' | 'CAT'
type CreatePetAgeGroup = 'PUPPY' | 'YOUNG' | 'ADULT' | 'SENIOR'
type CreatePetSize = 'SMALL' | 'MEDIUM' | 'LARGE'
type CreatePetEnergyLevel = 'LOW' | 'MEDIUM' | 'HIGH'
type CreatePetIndependenceLevel = 'LOW' | 'MEDIUM' | 'HIGH'
type CreatePetEnvironment = 'SMALL' | 'MEDIUM' | 'SPACIOUS'

export interface CreatePetUseCaseProps {
  name: string
  description: string
  type: CreatePetType
  ageGroup: CreatePetAgeGroup
  size: CreatePetSize
  energyLevel: CreatePetEnergyLevel
  independenceLevel: CreatePetIndependenceLevel
  environment: CreatePetEnvironment
  adoptionRequirements: string
  org_id: string
}

interface CreatePetUseCaseResponse {
  pet: PetResponse
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) { }

  async execute({
    name,
    adoptionRequirements,
    ageGroup,
    description,
    energyLevel,
    environment,
    independenceLevel,
    size,
    type,
    org_id
  }: CreatePetUseCaseProps) {
    const org = await this.orgsRepository.findById(org_id)
    if (!org) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      name,
      description,
      type,
      ageGroup,
      size,
      energyLevel,
      independenceLevel,
      environment,
      adoptionRequirements,
      org_id,
    })

    return {
      pet,
    }
  }
}
