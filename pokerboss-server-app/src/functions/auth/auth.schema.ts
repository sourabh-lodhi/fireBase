import Joi from 'joi'

export const authSSO = Joi.object({
  'device-id': Joi.string().required(),
  'firebase-token': Joi.string().required(),
}).options({ abortEarly: false })

export const authOtp = Joi.object({
  'email': Joi.string().email().optional(),
  'phone': Joi.string().min(10).optional(),
  'otp': Joi.string().min(4).max(4),
  'token': Joi.string().optional(),
  'device-id': Joi.string().required(),
}).options({ abortEarly: false })

export const authRegister = Joi.object({
  'username': Joi.string().optional().trim().min(4).max(30),
  'password': Joi.string().optional().min(8),
  'device-id': Joi.string().required(),
  'totp': Joi.string().optional(),
  'token': Joi.string().optional(),
}).options({ abortEarly: false })

export const authLogin = Joi.object({
  'device-id': Joi.string().required(),
  'username': Joi.string().trim().min(4).max(30),
  'password': Joi.string().min(8),
  'token': Joi.string(),
  'totp': Joi.string().min(6).max(6),
}).options({ abortEarly: false })

export const authReset = Joi.object({
  'device-id': Joi.string().required(),
  'username': Joi.string().trim().min(4).max(30),
  'password': Joi.string().min(8),
  'token': Joi.string(),
  'totp': Joi.string().min(6).max(6),
}).options({ abortEarly: false })

export const auth2FA = Joi.object({
  'email': Joi.string().email().optional(),
  'phone': Joi.string().min(10).optional(),
  'otp': Joi.string().min(4).max(4).optional(),
  'device-id': Joi.string().required(),
  'token': Joi.string().required(),
}).options({ abortEarly: false })
