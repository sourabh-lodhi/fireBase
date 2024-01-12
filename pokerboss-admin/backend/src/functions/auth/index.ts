import * as functions from 'firebase-functions/v2'
import * as controllers from './auth.controller'
import * as middleware from '../../middlewares'
import * as schemas from './auth.schema'
import * as handlers from '../../handlers'
// import * as util from '../../utils'

export const register = functions.https.onRequest(async (req, res) => {
  const middlewares = [
    middleware.checkHttpMethod('POST'),
    handlers.validateSchema(schemas.authRegister),
    controllers.registerUser,
  ]

  handlers.middleware(req, res, middlewares)
})

export const login = functions.https.onRequest(async (req, res) => {
  const middlewares = [
    middleware.checkHttpMethod('POST'),
    handlers.validateSchema(schemas.authLogin),
    controllers.userLogin,
  ]
  // Call the middleware handler
  handlers.middleware(req, res, middlewares)
})

export const resetPassword = functions.https.onRequest(async (req, res) => {
  const middlewares = [
    middleware.checkHttpMethod('POST'),
    handlers.validateSchema(schemas.authReset),
    controllers.reset,
  ]
  // Call the middleware handler
  handlers.middleware(req, res, middlewares)
})
