import jwt from 'jsonwebtoken'

export const generateJWTToken = (data) => {
  const TOKEN_EXPIRY = '1d'
  return jwt.sign(data, 'HARKUDACFRHVHFHWEFSFSG', {
    expiresIn: TOKEN_EXPIRY,
  })
}

export const verifyJWTToken = (token) => {
  return jwt.verify(token, 'HARKUDACFRHVHFHWEFSFSG')
}

export const decodeJWTToken = (token) => {
  return jwt.decode(token)
}
