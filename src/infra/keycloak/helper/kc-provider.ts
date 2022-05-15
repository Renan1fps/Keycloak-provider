import KcAdminClient from '@keycloak/keycloak-admin-client'

export class KcProvider {
  private readonly provider: KcAdminClient = null
  private static _instance: KcProvider

  private constructor () {}

  static get intance (): KcProvider {
    if (!this.intance) {
      KcProvider._instance = new KcProvider()
    }
    return this._instance
  }

  connect (): KcAdminClient {
    const adminClient = new KcAdminClient({
      baseUrl: process.env.KC_URL,
      realmName: process.env.KC_REALM
    })
    return adminClient
  }
}
