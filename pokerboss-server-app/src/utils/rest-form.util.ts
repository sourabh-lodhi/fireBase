import { Response } from 'firebase-functions'

type ValueType = {
  [key: string]: string | number | boolean | ValueType
}

type ErrorType = {
  [key: string]: string[]
}

type RestFormApiResponse<T> = {
  ok: boolean
  status: number
  data: T
}

type FunctionParams = {
  res: Response
  success: boolean
  values?: ValueType
  errors?: ErrorType
  notice: string[]
  statusCode: number
}

export const restFormResponseHandler = ({
  res, success, values, errors, notice, statusCode,
}: FunctionParams): void => {
  const response: RestFormApiResponse<{
    values: ValueType
    errors: ErrorType
    notice: string[]
  }> = {
    ok: success,
    status: statusCode,
    data: { values, errors, notice },
  }

  res.status(statusCode).json(response)
}

