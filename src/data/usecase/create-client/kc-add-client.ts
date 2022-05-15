import { IAddClientProvider } from '../../protocols/add-client-provider'

export class AddClient {
  constructor (
    private readonly addClientProvider: IAddClientProvider
  ) {}

  async add (clientName: string): Promise<string> {
    const clientId = await this.addClientProvider.add(clientName)
    return clientId
  }
}
