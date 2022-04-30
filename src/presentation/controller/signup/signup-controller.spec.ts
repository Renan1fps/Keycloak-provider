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
  test('shloud return 1 +1 true', async () => {
    const { sut } = makeSut()
    const response = await sut.handle()
    expect(response.status).toBe(400)
    expect(response.body).toEqual(new Error('missing email'))
  })
})
