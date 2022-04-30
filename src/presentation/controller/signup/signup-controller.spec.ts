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
    expect(response.body).toEqual(new Error('missing email'))
  })

  test('shloud return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      email: 'any_email@mail.com'
    }
    const response = await sut.handle(httpRequest)
    expect(response.status).toBe(400)
    expect(response.body).toEqual(new Error('missing password'))
  })
})
