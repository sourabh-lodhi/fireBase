import jwt from 'jsonwebtoken'
import * as constants from './constants.util'

export const generateJWTToken = (data) => {
  const TOKEN_EXPIRY = '1d'
  return jwt.sign(data, constants.JWT_SECRET_KEY, {
    expiresIn: TOKEN_EXPIRY,
  })
}

export const verifyJWTToken = (token) => {
  return jwt.verify(token, constants.JWT_SECRET_KEY)
}

export const decodeJWTToken = (token) => {
  return jwt.decode(token)
}

