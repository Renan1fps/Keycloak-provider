import { MissingParam } from '../../errors/missing-param'
import { badRequest } from '../../helpers/http-helper'
import { IEmailValidator } from '../../protocols/mail-validator'

export class SignUpController {
  constructor (
    private readonly mailValidator: IEmailValidator
  ) {}

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

    this.mailValidator.isValid(httpRequest.body.email)
  }
}
