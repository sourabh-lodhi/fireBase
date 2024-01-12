// Import the necessary dependencies and functions
import { checkauthtoken } from '../auth.middleware'
import * as util from '../../utils'

// Mock the required dependencies
jest.mock('../../utils', () => ({
  restFormResponseHandler: jest.fn(),
}))

jest.mock('../../utils/jwt.util', () => ({
  verifyJWTToken: jest.fn((token) => {
    if (token === 'validToken') {
      return { userId: '123456' }
    } else {
      throw new Error('Invalid token')
    }
  }),
}))

describe('checkauthtoken', () => {
  let req; let res; let next

  beforeEach(() => {
    // Initialize req, res, next for each test case
    req = {
      headers: {},
    }
    res = {}
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Token is missing', async () => {
    await checkauthtoken(req, res, next)

    expect(util.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      success: false,
      statusCode: 401,
      notice: ['Authentication token is missing'],
      errors: {},
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('Token is invalid', async () => {
    req.headers['x-access-token'] = 'invalidToken'
    await checkauthtoken(req, res, next)

    expect(util.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      success: false,
      statusCode: 401,
      notice: ['Authentication token is invalid'],
      errors: {},
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('Token is present and valid', async () => {
    req.headers['x-access-token'] = 'validToken'
    await checkauthtoken(req, res, next)

    expect(util.restFormResponseHandler).not.toHaveBeenCalled()
    expect(req.locals).toEqual({ userId: '123456' })
    expect(next).toHaveBeenCalled()
  })

  test('Token starts with "Bearer " prefix', async () => {
    req.headers.authorization = 'Bearer validToken'
    await checkauthtoken(req, res, next)

    expect(util.restFormResponseHandler).not.toHaveBeenCalled()
    expect(req.locals).toEqual({ userId: '123456' })
    expect(next).toHaveBeenCalled()
  })

  test('Token has incorrect "Bearer " prefix', async () => {
    req.headers.authorization = 'InvalidBearer validToken'
    await checkauthtoken(req, res, next)

    expect(util.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      success: false,
      statusCode: 401,
      notice: ['Authentication token is invalid'],
      errors: {},
    })
    expect(next).not.toHaveBeenCalled()
  })
})
