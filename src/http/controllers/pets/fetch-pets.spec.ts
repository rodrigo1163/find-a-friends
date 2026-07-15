import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Fetch Pets (e2e)', () => {
  let token: string

  beforeAll(async () => {
    await app.ready()

    const auth = await createAndAuthenticateUser(app)
    token = auth.token

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

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Mia',
        description: 'Gata calma e carinhosa',
        type: 'CAT',
        ageGroup: 'YOUNG',
        size: 'SMALL',
        energyLevel: 'LOW',
        independenceLevel: 'HIGH',
        environment: 'SMALL',
        adoptionRequirements: 'Ambiente tranquilo',
      })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch pets by city', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({ city: 'Manaus' })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(2)
    expect(response.body.pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Rex' }),
        expect.objectContaining({ name: 'Mia' }),
      ]),
    )
  })

  it('should be able to filter pets by type', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'Manaus',
        type: 'DOG',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Rex',
        type: 'DOG',
      }),
    )
  })

  it('should be able to filter pets by age group', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'Manaus',
        ageGroup: 'YOUNG',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Mia',
        ageGroup: 'YOUNG',
      }),
    )
  })

  it('should be able to filter pets by size', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'Manaus',
        size: 'MEDIUM',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Rex',
        size: 'MEDIUM',
      }),
    )
  })

  it('should be able to filter pets by energy level', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'Manaus',
        energyLevel: 'LOW',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Mia',
        energyLevel: 'LOW',
      }),
    )
  })

  it('should be able to filter pets by independence level', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'Manaus',
        independenceLevel: 'HIGH',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Mia',
        independenceLevel: 'HIGH',
      }),
    )
  })

  it('should be able to filter pets by environment', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'Manaus',
        environment: 'SPACIOUS',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Rex',
        environment: 'SPACIOUS',
      }),
    )
  })

  it('should be able to filter pets by multiple filters', async () => {
    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'Manaus',
        type: 'DOG',
        size: 'MEDIUM',
        energyLevel: 'HIGH',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Rex',
        type: 'DOG',
        size: 'MEDIUM',
        energyLevel: 'HIGH',
      }),
    )
  })
})
