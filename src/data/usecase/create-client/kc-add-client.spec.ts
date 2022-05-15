import { IAddClientProvider } from '../../protocols/add-client-provider'
import { AddClient } from './kc-add-client'

const makeAddClientProvider = (): IAddClientProvider => {
  class AddClientProviderStub implements IAddClientProvider {
    async add (client: string): Promise<string> {
      const fakeClientId = 'valid_id'
      return await new Promise(resolve => resolve(fakeClientId))
    }
  }

  return new AddClientProviderStub()
}

interface ISutTypes {
  sut: AddClient
  addClientProviderStub: IAddClientProvider
}

const makeSut = (): ISutTypes => {
  const addClientProviderStub = makeAddClientProvider()
  const sut = new AddClient(addClientProviderStub)

  return {
    sut,
    addClientProviderStub
  }
}

describe('AddClient Usecase', () => {
  test('Should calls addClient with correct values', async () => {
    const { sut } = makeSut()
    const isValidSpy = jest.spyOn(sut, 'add')
    const clientName = 'any_name'
    await sut.add(clientName)
    expect(isValidSpy).toHaveBeenCalledWith(clientName)
  })

  test('Should calls addClientProvider with correct values', async () => {
    const { sut, addClientProviderStub } = makeSut()
    const isValidSpy = jest.spyOn(addClientProviderStub, 'add')
    const clientName = 'any_name'
    await sut.add(clientName)
    expect(isValidSpy).toHaveBeenCalledWith(clientName)
  })

  test('Should throw if addClientProvider throws', async () => {
    const { sut, addClientProviderStub } = makeSut()
    jest.spyOn(addClientProviderStub, 'add').mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))
    const clientName = 'any_name'
    const promise = sut.add(clientName)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an id on success', async () => {
    const { sut } = makeSut()
    const clientName = 'any_name'
    const client = await sut.add(clientName)
    expect(client).toBe('valid_id')
  })
})
