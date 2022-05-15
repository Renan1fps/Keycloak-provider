import { IAddClientProvider } from '../../../data/protocols/add-client-provider'
import { KcProvider } from '../helper/kc-provider'

export class AddClientProvider implements IAddClientProvider {
  async add (clientInfos: string): Promise<string> {
    const keycloakProvider = KcProvider.intance.connect()

    const client = await keycloakProvider.clients.create({
      enabled: true,
      realm: '',
      serviceAccountsEnabled: true,
      protocol: 'openId',
      name: '',
      publicClient: false,
      bearerOnly: false,
      webOrigins: ['localhost:8080'],
      secret: ''
    })
    return client.id
  }
}
