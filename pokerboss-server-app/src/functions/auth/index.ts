import * as functions from 'firebase-functions'
import * as controllers from './auth.controller'
import * as middleware from '../../middlewares'
import * as schemas from './auth.schema'
import * as handlers from '../../handlers'
import * as util from '../../utils'

export const sso = functions.https.onRequest(async (request, response) => {
  try {
    const middlewares = [
      middleware.checkHttpMethod('POST'),
      handlers.validateSchema(schemas.authSSO),
      controllers.sso,
    ]
    handlers.middleware(request, response, middlewares)
  } catch (error) {
    return util.restFormResponseHandler({
      res: response,
      success: false,
      statusCode: 500,
      notice: ['Something went wrong while executing auth-sso function'],
    })
  }
})

export const otp = functions.https.onRequest((req, res) => {
  const middlewares = [
    middleware.checkHttpMethod('POST'),
    handlers.validateSchema(schemas.authOtp),
    controllers.otp,
  ]

  handlers.middleware(req, res, middlewares)
})

export const register = functions.https.onRequest(async (req, res) => {
  const middlewares = [
    middleware.checkHttpMethod('POST'),
    handlers.validateSchema(schemas.authRegister),
    controllers.register,
  ]

  handlers.middleware(req, res, middlewares)
})

export const login = functions.https.onRequest(async (req, res) => {
  const middlewares = [
    middleware.checkHttpMethod('POST'),
    handlers.validateSchema(schemas.authLogin),
    controllers.login,
  ]
  // Call the middleware handler
  handlers.middleware(req, res, middlewares)
})

export const reset = functions.https.onRequest(async (req, res) => {
  const middlewares = [
    middleware.checkHttpMethod('POST'),
    handlers.validateSchema(schemas.authReset),
    controllers.reset,
  ]
  // Call the middleware handler
  handlers.middleware(req, res, middlewares)
})

export const twoFA = functions.https.onRequest(async (req, res)=>{
  const middlewares = [
    middleware.checkHttpMethod('POST'),
    handlers.validateSchema(schemas.auth2FA),
    controllers.auth2FA,
  ]
  // Call the middleware handler
  handlers.middleware(req, res, middlewares)
})
