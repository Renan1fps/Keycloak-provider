import { MissingParam } from '../../errors/missing-param'
import { SignUpController } from './signup-controller'

interface ISutTypes {
  sut: SignUpController
}

const makeSut = (): ISutTypes => {
  const sut = new SignUpController()
  return {
    sut
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      password: 'any_password'
    }
    const response = await sut.handle(httpRequest)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(new MissingParam('email'))
    expect(response.body).toBeInstanceOf(MissingParam)
  })

  test('shloud return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      email: 'any_email@mail.com'
    }
    const response = await sut.handle(httpRequest)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(new MissingParam('password'))
    expect(response.body).toBeInstanceOf(MissingParam)
  })

  test('shloud return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    const response = await sut.handle(httpRequest)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(new MissingParam('passwordConfirmation'))
    expect(response.body).toBeInstanceOf(MissingParam)
  })

  test('shloud return 400 if if the passwords are different', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'different_passowrd'
    }
    const response = await sut.handle(httpRequest)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(new Error('password is fails'))
  })
})
