import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const email = 'john.doe@example.com'
  const password = '123456'

  await request(app.server)
    .post('/orgs')
    .send({
      org: {
        name: 'John Doe',
        email,
        phone: '93933939339',
        password,
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

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email,
      password,
    })

  const { token } = authResponse.body

  return {
    token,
  }
}
