export class SignUpController {
  async handle (): Promise<any> {
    return {
      status: 400,
      body: new Error('missing email')
    }
  }
}
