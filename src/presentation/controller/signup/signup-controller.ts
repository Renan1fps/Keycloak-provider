import {
  badRequest,
  Controller,
  IEmailValidator,
  InvalidParamError,
  IHttpRequest, IHttpResponse,
  MissingParam,
  ServerError,
  serverError
} from './signup-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly mailValidator: IEmailValidator
  ) { }

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
