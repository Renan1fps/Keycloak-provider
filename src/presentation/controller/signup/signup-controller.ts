import { IAddAccountUseCase } from '../../../domain/usecase/protocols/add-account'
import {
  badRequest,
  Controller,
  IEmailValidator,
  InvalidParamError,
  IHttpRequest, IHttpResponse,
  MissingParam,
  ServerError,
  serverError,
  success
} from './signup-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly mailValidator: IEmailValidator,
    private readonly addAccountUseCase: IAddAccountUseCase
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

      const isValidEmail = this.mailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const response = await this.addAccountUseCase.add({ email, password })

      return success(response)
    } catch (err) {
      return serverError(new ServerError())
    }
  }
}
