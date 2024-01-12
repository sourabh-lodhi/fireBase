const bcrypt = require('bcryptjs')
const speakeasy = require('speakeasy')

export const createPasswordHash = (password: string) => {
  return bcrypt.hash(password, 10)
}

export const comparePassword = (password: string, collectionPassword: string) => {
  return bcrypt.compare(password, collectionPassword)
}
export const generateSecretKey = () =>
  speakeasy.generateSecret({
    issuer: 'PokerBoss',
  }).base32

export const verifyTotp = (totp: string, secretKey: string) => {
  return speakeasy.totp.verify({
    secret: secretKey,
    encoding: 'base32',
    token: totp,
  })
}
