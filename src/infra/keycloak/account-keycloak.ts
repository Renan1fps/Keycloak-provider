import { IAccountModel } from '../../domain/models/account'
import { IAddAccountModel } from '../../domain/usecase/protocols/add-account'

export interface IKeycloakProviderUser{
  add: (account: IAddAccountModel) => Promise<IAccountModel>
}
