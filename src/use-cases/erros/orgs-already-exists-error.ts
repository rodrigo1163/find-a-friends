export class OrgsAlreadyExistsError extends Error {
  constructor() {
    super('Org already exists.')
  }
}