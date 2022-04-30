export class SignUpController {
  async handle (httpRequest: any): Promise<any> {
    if (!httpRequest.email) {
      return {
        status: 400,
        body: new Error('missing email')
      }
    }

    if (!httpRequest.password) {
      return {
        status: 400,
        body: new Error('missing password')
      }
    }

    if (!httpRequest.passwordConfirmation) {
      return {
        status: 400,
        body: new Error('missing passwordConfirmation')
      }
    }

    if (httpRequest.passwordConfirmation !== httpRequest.password) {
      return {
        status: 400,
        body: new Error('password is fails')
      }
    }
  }
}
