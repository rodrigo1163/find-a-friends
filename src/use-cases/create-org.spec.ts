import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateOrgUseCase } from './create-org-use-case'
import { InMemoryAddressOrgsRepository } from '@/repositories/in-memory/in-memory-address-repository'
import { OrgsAlreadyExistsError } from './erros/orgs-already-exists-error'

// Unit testing

let orgsRepository: InMemoryOrgsRepository
let addressOrgsRepository: InMemoryAddressOrgsRepository
let sut: CreateOrgUseCase

describe('Register an Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    addressOrgsRepository = new InMemoryAddressOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository, addressOrgsRepository)
  })

  it('should be able to register an org', async () => {
    const { org } = await sut.execute({
      org: {
        password: '123456',
        name: 'John Doe',
        phone: '93933939339',
        email: 'johndoe@example.com',
      },
      addressOrg: {
        cep: '69000000',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Manaus',
        state: 'AM',
        latitude: -3.1190275,
        longitude: -60.0217314,
        complement: 'Sala 2',
        country: 'Brasil',
        reference: 'Próximo ao mercado central'
      }
    })

    expect(org.id).toEqual(expect.any(String))
  })
  it('should be able to register an org', async () => {
    const { org } = await sut.execute({
      org: {
        password: '123456',
        name: 'John Doe',
        phone: '93933939339',
        email: 'johndoe@example.com',
      },
      addressOrg: {
        cep: '69000000',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Manaus',
        state: 'AM',
        latitude: -3.1190275,
        longitude: -60.0217314,
        complement: 'Sala 2',
        country: 'Brasil',
        reference: 'Próximo ao mercado central'
      }
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { org } = await sut.execute({
      org: {
        password: '123456',
        name: 'John Doe',
        phone: '93933939339',
        email: 'johndoe@example.com',
      },
      addressOrg: {
        cep: '69000000',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Manaus',
        state: 'AM',
        latitude: -3.1190275,
        longitude: -60.0217314,
        complement: 'Sala 2',
        country: 'Brasil',
        reference: 'Próximo ao mercado central'
      }
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      org.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      org: {
        password: '123456',
        name: 'John Doe',
        phone: '93933939339',
        email: 'johndoe@example.com',
      },
      addressOrg: {
        cep: '69000000',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Manaus',
        state: 'AM',
        latitude: -3.1190275,
        longitude: -60.0217314,
        complement: 'Sala 2',
        country: 'Brasil',
        reference: 'Próximo ao mercado central'
      }
    })

    await expect(() =>
      sut.execute({
        org: {
          password: '123456',
          name: 'John Doe',
          phone: '93933939339',
          email: 'johndoe@example.com',
        },
        addressOrg: {
          cep: '69000000',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Manaus',
          state: 'AM',
          latitude: -3.1190275,
          longitude: -60.0217314,
          complement: 'Sala 2',
          country: 'Brasil',
          reference: 'Próximo ao mercado central'
        }
      })
    ).rejects.toBeInstanceOf(OrgsAlreadyExistsError)
  })

  it('should be able to register an org with address', async () => {
    const { org, addressOrg } = await sut.execute({
      org: {
        password: '123456',
        name: 'John Doe',
        phone: '93933939339',
        email: 'johndoe@example.com',
      },
      addressOrg: {
        cep: '69000000',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Manaus',
        state: 'AM',
        latitude: -3.1190275,
        longitude: -60.0217314,
        complement: 'Sala 2',
        country: 'Brasil',
        reference: 'Próximo ao mercado central'
      }
    })

    expect(org.id).toEqual(expect.any(String))
    expect(addressOrg.org_id).toEqual(org.id)
  })

  it('should persist optional address fields', async () => {
    await sut.execute({
      org: {
        password: '123456',
        name: 'John Doe',
        phone: '93933939339',
        email: 'johndoe@example.com',
      },
      addressOrg: {
        cep: '69000000',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Manaus',
        state: 'AM',
        latitude: -3.1190275,
        longitude: -60.0217314,
        complement: 'Sala 2',
        country: 'Brasil',
        reference: 'Próximo ao mercado central',
      },
    })

    expect(addressOrgsRepository.items).toHaveLength(1)
    expect(addressOrgsRepository.items[0]).toMatchObject({
      complement: 'Sala 2',
      country: 'Brasil',
      reference: 'Próximo ao mercado central',
    })
  })

  it('should store default country when not provided', async () => {
    await sut.execute({
      org: {
        password: '123456',
        name: 'John Doe',
        phone: '93933939339',
        email: 'johndoe@example.com',
      },
      addressOrg: {
        cep: '69000000',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'Manaus',
        state: 'AM',
        latitude: -3.1190275,
        longitude: -60.0217314,
      },
    })

    expect(addressOrgsRepository.items).toHaveLength(1)
    expect(addressOrgsRepository.items[0].country).toBe('Brasil')
  })

})
