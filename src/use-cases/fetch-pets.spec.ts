import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchPetsUseCase } from './fetch-pets-use-case'

let petsRepository: InMemoryPetsRepository
let sut: FetchPetsUseCase

describe('Fetch Pets Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new FetchPetsUseCase(petsRepository)
  })

  it('should be able to fetch pets by city', async () => {
    petsRepository.items.push({
      id: 'pet-1',
      name: 'Rex',
      description: 'Cachorro dócil e brincalhão',
      type: 'DOG',
      ageGroup: 'ADULT',
      size: 'MEDIUM',
      energyLevel: 'HIGH',
      independenceLevel: 'MEDIUM',
      environment: 'SPACIOUS',
      adoptionRequirements: 'Ter quintal espaçoso',
      createdAt: new Date(),
      org_id: 'org-1',
      org: {
        address: {
          city: 'Manaus',
        },
      },
    })

    const pets = await sut.execute({ city: 'Manaus' })

    expect(pets).toHaveLength(1)
    expect(pets[0].name).toEqual('Rex')
  })

  it('should not list pets from other cities', async () => {
    petsRepository.items.push(
      {
        id: 'pet-1',
        name: 'Rex',
        description: 'Cachorro dócil e brincalhão',
        type: 'DOG',
        ageGroup: 'ADULT',
        size: 'MEDIUM',
        energyLevel: 'HIGH',
        independenceLevel: 'MEDIUM',
        environment: 'SPACIOUS',
        adoptionRequirements: 'Ter quintal espaçoso',
        createdAt: new Date(),
        org_id: 'org-1',
        org: {
          address: {
            city: 'Manaus',
          },
        },
      },
      {
        id: 'pet-2',
        name: 'Mia',
        description: 'Gata calma e carinhosa',
        type: 'CAT',
        ageGroup: 'YOUNG',
        size: 'SMALL',
        energyLevel: 'LOW',
        independenceLevel: 'HIGH',
        environment: 'SMALL',
        adoptionRequirements: 'Ambiente tranquilo',
        createdAt: new Date(),
        org_id: 'org-2',
        org: {
          address: {
            city: 'São Paulo',
          },
        },
      },
    )

    const pets = await sut.execute({ city: 'Manaus' })

    expect(pets).toHaveLength(1)
    expect(pets[0].name).toEqual('Rex')
  })

  it('should be able to filter pets by type', async () => {
    petsRepository.items.push(
      {
        id: 'pet-1',
        name: 'Rex',
        description: 'Cachorro dócil e brincalhão',
        type: 'DOG',
        ageGroup: 'ADULT',
        size: 'MEDIUM',
        energyLevel: 'HIGH',
        independenceLevel: 'MEDIUM',
        environment: 'SPACIOUS',
        adoptionRequirements: 'Ter quintal espaçoso',
        createdAt: new Date(),
        org_id: 'org-1',
        org: {
          address: {
            city: 'Manaus',
          },
        },
      },
      {
        id: 'pet-2',
        name: 'Mia',
        description: 'Gata calma e carinhosa',
        type: 'CAT',
        ageGroup: 'YOUNG',
        size: 'SMALL',
        energyLevel: 'LOW',
        independenceLevel: 'HIGH',
        environment: 'SMALL',
        adoptionRequirements: 'Ambiente tranquilo',
        createdAt: new Date(),
        org_id: 'org-2',
        org: {
          address: {
            city: 'Manaus',
          },
        },
      },
    )

    const pets = await sut.execute({ city: 'Manaus', type: 'DOG' })

    expect(pets).toHaveLength(1)
    expect(pets[0].type).toEqual('DOG')
  })

  it('should be able to filter pets by multiple filters', async () => {
    petsRepository.items.push(
      {
        id: 'pet-1',
        name: 'Rex',
        description: 'Cachorro dócil e brincalhão',
        type: 'DOG',
        ageGroup: 'ADULT',
        size: 'MEDIUM',
        energyLevel: 'HIGH',
        independenceLevel: 'MEDIUM',
        environment: 'SPACIOUS',
        adoptionRequirements: 'Ter quintal espaçoso',
        createdAt: new Date(),
        org_id: 'org-1',
        org: {
          address: {
            city: 'Manaus',
          },
        },
      },
      {
        id: 'pet-2',
        name: 'Thor',
        description: 'Cachorro grande e ativo',
        type: 'DOG',
        ageGroup: 'ADULT',
        size: 'LARGE',
        energyLevel: 'HIGH',
        independenceLevel: 'LOW',
        environment: 'SPACIOUS',
        adoptionRequirements: 'Ter quintal espaçoso',
        createdAt: new Date(),
        org_id: 'org-2',
        org: {
          address: {
            city: 'Manaus',
          },
        },
      },
    )

    const pets = await sut.execute({
      city: 'Manaus',
      type: 'DOG',
      size: 'MEDIUM',
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].name).toEqual('Rex')
  })

  it('should return an empty list when no pets match the filters', async () => {
    const pets = await sut.execute({ city: 'Manaus' })

    expect(pets).toHaveLength(0)
  })
})
