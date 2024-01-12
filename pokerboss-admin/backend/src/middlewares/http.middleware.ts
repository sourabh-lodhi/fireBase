import { Request, Response } from 'firebase-functions'
import * as util from '../utils'

// Valid HTTP methods
export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE'

// Intercepts request and verifies the request method type
export const checkHttpMethod = (method: HttpMethod) => {
  // Request handler, sends response to client if method not matches or call to next middleware from middleware chain
  const handler = (req: Request, res: Response, next) => {
    // extracting method name
    const { method: reqMethod } = req

    // Check if the request method ('reqMethod') matches the provided 'method'
    if (reqMethod !== method) {
      // If the methods don't match, send a response indicating that the method is not allowed
      util.restFormResponseHandler({
        res,
        success: false,
        statusCode: 401,
        notice: [`${reqMethod} Method Not Allowed`],
        errors: {},
      })
    } else {
      // If the request method matches the provided 'method', call the 'next' function if available
      next?.()
    }
  }

  return handler
}

// export const checkposthttp = (req, res, next) => {
//   if (req.method !== 'POST') {
//     return res.status(401).json({ notice: 'HTTP Method Not Allowed' })
//   } else {
//     next()
//   }
// }

// export const checkgethttp = (req, res, next) => {
//   if (req.method !== 'GET') {
//     return res.status(401).json({ notice: 'HTTP Method Not Allowed' })
//   } else {
//     next()
//   }
// }
