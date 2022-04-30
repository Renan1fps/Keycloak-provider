import { MissingParam } from '../../errors/missing-param'
import { badRequest } from '../../helpers/http-helper'

export class SignUpController {
  async handle (httpRequest: any): Promise<any> {
    const requiredFields = ['email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParam(field))
      }
    }

    if (httpRequest.body.passwordConfirmation !== httpRequest.body.password) {
      return {
        status: 400,
        body: new Error('password is fails')
      }
    }
  }
}
