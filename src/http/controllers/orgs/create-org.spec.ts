import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Create Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an org', async () => {
    const response = await request(app.server)
      .post('/orgs')
      .send({
        org: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '93933939339',
          password: '123456',
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

    expect(response.statusCode).toEqual(201)
  })
})
