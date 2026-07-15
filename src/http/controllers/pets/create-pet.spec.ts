import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rex',
        description: 'Cachorro dócil e brincalhão',
        type: 'DOG',
        ageGroup: 'ADULT',
        size: 'MEDIUM',
        energyLevel: 'HIGH',
        independenceLevel: 'MEDIUM',
        environment: 'SPACIOUS',
        adoptionRequirements: 'Ter quintal espaçoso',
      })

    expect(response.statusCode).toEqual(201)
  })
})
