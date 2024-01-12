import * as Joi from 'joi'

export const isEmailValid = (email: string) => {
  return email.indexOf('@pokerboss.dev', email.length - '@pokerboss.dev'.length) !== -1
}

export const authRegister = Joi.object({
  email: Joi.string().email().custom(isEmailValid),
  password: Joi.string().min(8).max(30),
  tOtp: Joi.string().min(6),
  token: Joi.string(),
}).options({ abortEarly: false })

export const authLogin = Joi.object({
  secretKey: Joi.string().min(6),
  email: Joi.string().email().custom(isEmailValid),
  password: Joi.string().min(6).max(30),
  token: Joi.string(),
  tOtp: Joi.string().min(6).max(6),
}).options({ abortEarly: false })

export const authReset = Joi.object({
  email: Joi.string().email().custom(isEmailValid),
  emailOtp: Joi.string().min(6).max(6),
  newPassword: Joi.string().min(6).max(30),
  token: Joi.string(),
}).options({ abortEarly: false })
