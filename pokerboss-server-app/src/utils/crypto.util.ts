import speakeasy from 'speakeasy'
import bcrypt from 'bcryptjs'

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

export const createPasswordHash = (password: string) => {
  return bcrypt.hash(password, 10)
}

export const comparePassword = (password: string, hashPassword: string) => {
  return bcrypt.compareSync(password, hashPassword)
}
