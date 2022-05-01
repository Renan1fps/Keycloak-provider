import { IKeycloakProviderUser } from '../../../infra/keycloak/account-keycloak'
import { IAccountModel } from '../../models/account'
import { IAddAccountModel } from '../protocols/add-account'

const makeSut = (): IKeycloakProviderUser => {
  class KeycloakProviderUserStub implements IKeycloakProviderUser {
    async add (account: IAddAccountModel): Promise<IAccountModel> {
      const fakeIdAccount = {
        idKeycloak: 'valid_id'
      }
      return await new Promise(resolve => resolve(fakeIdAccount))
    }
  }

  return new KeycloakProviderUserStub()
}

describe('AddAccount UseCase', () => {
  test('Should return id on success', async () => {
    const sut = makeSut()
    const account = {
      email: 'valid_email',
      password: 'valid_password'
    }
    const result = await sut.add(account)
    expect(result).toBeTruthy()
    expect(result).toEqual({ idKeycloak: 'valid_id' })
  })
})
