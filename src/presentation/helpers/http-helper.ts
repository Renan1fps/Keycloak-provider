
export const badRequest = (err: Error): any => ({
  status: 400,
  body: err
})
