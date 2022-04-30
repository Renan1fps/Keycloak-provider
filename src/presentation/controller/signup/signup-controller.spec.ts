import { IAccountModel } from '../../../domain/models/account'
import { IAddAccountModel, IAddAccountUseCase } from '../../../domain/usecase/add-account'
import { SignUpController } from './signup-controller'
import {
  IEmailValidator,
  InvalidParamError,
  MissingParam,
  ServerError
} from './signup-protocols'

const makeAddAccountUseCase = (): IAddAccountUseCase => {
  class AddAccountUseCaseStup implements IAddAccountUseCase {
    async add (account: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        idKeycloak: 'valid_id'
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountUseCaseStup()
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
interface ISutTypes {
  sut: SignUpController
  mailValidator: IEmailValidator
  addAccountUseCase: IAddAccountUseCase
}

const makeSut = (): ISutTypes => {
  const mailValidator = makeEmailValidator()
  const addAccountUseCase = makeAddAccountUseCase()
  const sut = new SignUpController(mailValidator, addAccountUseCase)
  return {
    sut,
    mailValidator,
    addAccountUseCase
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParam('email'))
    expect(response.body).toBeInstanceOf(MissingParam)
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParam('password'))
    expect(response.body).toBeInstanceOf(MissingParam)
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParam('passwordConfirmation'))
    expect(response.body).toBeInstanceOf(MissingParam)
  })

  test('Should return 400 if the passwords are different', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'different_passowrd'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 400  if invalid email is provided', async () => {
    const { sut, mailValidator } = makeSut()
    jest.spyOn(mailValidator, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  test('Should calls emailValidator with corret values', async () => {
    const { sut, mailValidator } = makeSut()
    const isValidSpy = jest.spyOn(mailValidator, 'isValid')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 500 if emailValidator throws', async () => {
    const { sut, mailValidator } = makeSut()
    jest.spyOn(mailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should calls addAccountUseCase with corret values', async () => {
    const { sut, addAccountUseCase } = makeSut()
    const isValidSpy = jest.spyOn(addAccountUseCase, 'add')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
})
