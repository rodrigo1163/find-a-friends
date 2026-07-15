import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Get Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a pet by id', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
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

    const fetchResponse = await request(app.server)
      .get('/pets')
      .query({ city: 'Manaus' })

    const petId = fetchResponse.body.pets[0].id

    const response = await request(app.server).get(`/pets/${petId}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      pet: expect.objectContaining({
        id: petId,
        name: 'Rex',
        type: 'DOG',
      }),
    })
  })
})
