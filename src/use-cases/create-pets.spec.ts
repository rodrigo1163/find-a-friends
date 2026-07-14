import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreatePetUseCase } from './create-pets-use-case'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to create a pet', async () => {
    const org = await orgsRepository.create({
      name: 'ONG Amigos',
      email: 'ong@example.com',
      phone: '92999999999',
      password_hash: '123456',
    })

    const { pet } = await sut.execute({
      name: 'Rex',
      description: 'Cachorro dócil e brincalhão',
      type: 'DOG',
      ageGroup: 'ADULT',
      size: 'MEDIUM',
      energyLevel: 'HIGH',
      independenceLevel: 'MEDIUM',
      environment: 'SPACIOUS',
      adoptionRequirements: 'Ter quintal espaçoso',
      org_id: org.id,
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.org_id).toEqual(org.id)
    expect(pet.name).toEqual('Rex')
  })

  it('should not be able to create a pet with a non-existing org', async () => {
    await expect(() =>
      sut.execute({
        name: 'Rex',
        description: 'Cachorro dócil e brincalhão',
        type: 'DOG',
        ageGroup: 'ADULT',
        size: 'MEDIUM',
        energyLevel: 'HIGH',
        independenceLevel: 'MEDIUM',
        environment: 'SPACIOUS',
        adoptionRequirements: 'Ter quintal espaçoso',
        org_id: 'non-existing-org-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should persist pet data correctly', async () => {
    const org = await orgsRepository.create({
      name: 'ONG Amigos',
      email: 'ong@example.com',
      phone: '92999999999',
      password_hash: '123456',
    })

    await sut.execute({
      name: 'Mia',
      description: 'Gata calma e carinhosa',
      type: 'CAT',
      ageGroup: 'YOUNG',
      size: 'SMALL',
      energyLevel: 'LOW',
      independenceLevel: 'HIGH',
      environment: 'SMALL',
      adoptionRequirements: 'Ambiente tranquilo',
      org_id: org.id,
    })

    expect(petsRepository.items).toHaveLength(1)
    expect(petsRepository.items[0]).toMatchObject({
      name: 'Mia',
      description: 'Gata calma e carinhosa',
      type: 'CAT',
      ageGroup: 'YOUNG',
      size: 'SMALL',
      energyLevel: 'LOW',
      independenceLevel: 'HIGH',
      environment: 'SMALL',
      adoptionRequirements: 'Ambiente tranquilo',
      org_id: org.id,
    })
  })
})
