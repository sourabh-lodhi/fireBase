import * as util from '../crypto.util'

describe('crypto', () => {
  test('create bcrypt password', async () => {
    const password = 'pokerboss'
    const hashPassword = await util.createPasswordHash(password)
    expect(password).not.toEqual(hashPassword)
  })
  test('compare bcrypt password', async () => {
    const password = 'pokerboss'
    const hashPassword = await util.createPasswordHash(password)
    const result = util.comparePassword(password, hashPassword)
    expect(result).toBeTruthy()
  })
  test('generateSecretKey should return a valid secret key', () => {
    const secretKey = util.generateSecretKey()
    expect(typeof secretKey).toBe('string')
    expect(secretKey.length).toBeGreaterThan(0)
  })

  test('verifyTotp should return false for an invalid TOTP', () => {
    const secretKey = 'ABC123DEF456GHI789'
    const totp = '999999'
    const isValid = util.verifyTotp(totp, secretKey)
    expect(isValid).toBe(false)
  })
})
