import { badRequest } from '../../helpers/http-helper'

export class SignUpController {
  async handle (httpRequest: any): Promise<any> {
    const requiredFields = ['email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest[field]) {
        return badRequest(new Error(`missing ${field}`))
      }
    }

    if (httpRequest.passwordConfirmation !== httpRequest.password) {
      return {
        status: 400,
        body: new Error('password is fails')
      }
    }
  }
}
