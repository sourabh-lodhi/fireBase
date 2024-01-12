import * as util from '../utils'

import { verifyJWTToken } from '../utils/jwt.util'
export const checkauthtoken = async (req, res, next) => {
  // Get the JWT token from the request headers
  // Express headers are auto converted to lowercase
  let token = req.headers['x-access-token'] || req.headers.authorization
  if (!token) {
    return util.restFormResponseHandler({
      res,
      success: false,
      statusCode: 401,
      notice: ['Authentication token is missing'],
      errors: {},
    })
  } else {
    // Verify and decode the JWT token
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length) // Remove Bearer from string
    }

    try {
      const jwtresult = verifyJWTToken(token)
      req.locals = jwtresult
      next()
    } catch (error) {
      return util.restFormResponseHandler({
        res,
        success: false,
        statusCode: 401,
        notice: ['Authentication token is invalid'],
        errors: {},
      })
    }
  }
}
