import jwt from 'jsonwebtoken'
import * as util from '../jwt.util'

const SECRET_KEY = 'DESFRCSEVSSDWRCSCRVSRV'

describe('generateJWTToken', () => {
  test('should generate a valid JWT token for valid data', () => {
    const data = { id: 1, username: 'john.doe' }
    const token = util.generateJWTToken(data)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })
})

describe('verifyJWTToken', () => {
  test('should verify a valid JWT token', () => {
    const data = { id: 1, username: 'john.doe', iat: Date.now() }
    const token = jwt.sign(data, SECRET_KEY)
    const decodedToken = util.verifyJWTToken(token)
    expect(decodedToken).toEqual(data)
  })
})

describe('decodeJWTToken', () => {
  test('should decode a valid JWT token', () => {
    const data = { id: 1, username: 'john.doe', iat: Date.now() }
    const token = jwt.sign(data, SECRET_KEY)
    const decodedToken = util.decodeJWTToken(token)
    expect(decodedToken).toEqual(data)
  })
})
