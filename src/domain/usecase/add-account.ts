import { IAccountModel } from '../models/account'

export interface IAddAccountModel{
  email: string
  password: string
}

export interface IAddAccountUseCase{
  add: (account: IAddAccountModel) => Promise<IAccountModel>
}
