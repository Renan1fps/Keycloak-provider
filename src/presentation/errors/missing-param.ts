export class MissingParam extends Error {
  constructor (paramError: string) {
    super(`Missing param ${paramError}`)
    this.message = 'MissingParamError'
  }
}
