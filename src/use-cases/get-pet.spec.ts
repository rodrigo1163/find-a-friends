import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetPetUseCase } from './get-pet-use-case'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let sut: GetPetUseCase

describe('Get Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetUseCase(petsRepository)
  })

  it('should be able to get a pet by id', async () => {
    const pet = await petsRepository.create({
      name: 'Rex',
      description: 'Cachorro dócil e brincalhão',
      type: 'DOG',
      ageGroup: 'ADULT',
      size: 'MEDIUM',
      energyLevel: 'HIGH',
      independenceLevel: 'MEDIUM',
      environment: 'SPACIOUS',
      adoptionRequirements: 'Ter quintal espaçoso',
      org_id: 'org-1',
    })

    const result = await sut.execute(pet.id)

    expect(result).toEqual(
      expect.objectContaining({
        id: pet.id,
        name: 'Rex',
        type: 'DOG',
        org_id: 'org-1',
      }),
    )
  })

  it('should return null when pet does not exist', async () => {
    

    await expect(() => sut.execute('non-existing-pet-id')).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
