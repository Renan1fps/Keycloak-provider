import { IHttpResponse } from '../protocols/http'

export const badRequest = (err: Error): IHttpResponse => ({
  statusCode: 400,
  body: err
})

export const serverError = (err: Error): IHttpResponse => ({
  statusCode: 500,
  body: err
})
