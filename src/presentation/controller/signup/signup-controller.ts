import { InvalidParamError } from '../../errors/invalid-param'
import { MissingParam } from '../../errors/missing-param'
import { ServerError } from '../../errors/server-error'
import { badRequest, serverError } from '../../helpers/http-helper'
import { IHttpRequest, IHttpResponse } from '../../protocols/http'
import { IEmailValidator } from '../../protocols/mail-validator'

export class SignUpController {
  constructor (
    private readonly mailValidator: IEmailValidator
  ) {}

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParam(field))
        }
      }

      if (httpRequest.body.passwordConfirmation !== httpRequest.body.password) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      this.mailValidator.isValid(httpRequest.body.email)
    } catch (err) {
      return serverError(new ServerError())
    }
  }
}
