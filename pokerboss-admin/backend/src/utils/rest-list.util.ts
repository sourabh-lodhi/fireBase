import { Request, Response } from 'firebase-functions/v1'

type GetRequestParams = {
  filter: string[]
  sort: string[]
  page: number
  size: number
}

type RestListApiResponse<T> = {
  ok: boolean
  status: number
  data: T
}

export const restListRequestHandler = (req: Request): GetRequestParams => {
  const { filter, sort, page, size } = req.query

  // Parse comma-separated strings into arrays
  const filterParams = typeof filter === 'string' ? filter.split(',') : []
  const sortParams = typeof sort === 'string' ? sort.split(',') : []

  // Extract and validate the query parameters
  const pageParam = Number(page) || 1
  const sizeParam = Number(size) || 10

  return {
    filter: filterParams,
    sort: sortParams,
    page: pageParam,
    size: sizeParam,
  }
}

export const restListResponseHandler = <T>(res: Response, success: boolean, data: T[], statusCode: number): void => {
  const response: RestListApiResponse<T[]> = {
    ok: success,
    status: statusCode,
    data,
  }

  res.status(statusCode).json(response)
}
