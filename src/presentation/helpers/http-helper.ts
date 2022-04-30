
export const badRequest = (err: Error): any => ({
  status: 400,
  body: err
})

export const serverError = (err: Error): any => ({
  status: 500,
  body: err
})
