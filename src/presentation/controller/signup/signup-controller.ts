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
      const { email, password, passwordConfirmation } = httpRequest.body
      if (passwordConfirmation !== password) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      this.mailValidator.isValid(email)
    } catch (err) {
      return serverError(new ServerError())
    }
  }
}
