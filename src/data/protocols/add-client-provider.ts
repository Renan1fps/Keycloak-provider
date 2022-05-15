export interface IAddClientProvider{
  add: (client: string) => Promise<string>
}
