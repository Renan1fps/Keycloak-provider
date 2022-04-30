import { MissingParam } from '../../errors/missing-param'
import { IEmailValidator } from '../../protocols/mail-validator'
import { SignUpController } from './signup-controller'

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
}

const makeSut = (): ISutTypes => {
  const mailValidator = makeEmailValidator()
  const sut = new SignUpController(mailValidator)
  return {
    sut,
    mailValidator
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
    expect(response.status).toBe(400)
    expect(response.body).toEqual(new MissingParam('email'))
    expect(response.body).toBeInstanceOf(MissingParam)
  })

  test('shloud return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(new MissingParam('password'))
    expect(response.body).toBeInstanceOf(MissingParam)
  })

  test('shloud return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(new MissingParam('passwordConfirmation'))
    expect(response.body).toBeInstanceOf(MissingParam)
  })

  test('shloud return 400 if if the passwords are different', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'different_passowrd'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(new Error('password is fails'))
  })

  test('shloud calls emailValidator with corret values', async () => {
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
})
