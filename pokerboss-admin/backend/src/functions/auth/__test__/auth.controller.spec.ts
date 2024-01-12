// Import the necessary modules and functions
import * as admin from 'firebase-admin'
import { registerUser } from '../auth.controller'
import * as utils from '../../../utils' // Update with actual path
import * as services from '../../../services' // Update with actual path

// Mock the necessary functions from 'utils' and 'services' modules
jest.mock('../../../utils', () => ({
  generateSecretKey: jest.fn(() => 'mocked-secret-key'),
  generateJWTToken: jest.fn(() => 'mocked-jwt-token'),
  createPasswordHash: jest.fn(() => 'mocked-hash-password'),
  verifyTotp: jest.fn(() => true),
  restFormResponseHandler: jest.fn(),
}))

jest.mock('../../../services', () => ({
  findUsers: jest.fn(() => []),
  createUser: jest.fn(() => ({ id: 'mocked-user-id' })),
  addAuthHistory: jest.fn(),
}))

describe('registerUser', () => {
  let req
  let res
  beforeAll(() => {
    admin.initializeApp()
  })
  beforeEach(() => {
    req = {
      body: {},
    }
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle case where email and password are missing', async () => {
    req.body = { tOtp: 'mocked-tOtp', token: 'mocked-token' }
    await registerUser(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      success: false,
      errors: { error: ['email and password are required'] },
      notice: ['Validation error'],
      statusCode: 400,
    })
  })

  // Add more test cases for other scenarios, similar to the above example

  it('should handle successful registration with token and tOtp', async () => {
    req.body = {
      tOtp: 'mocked-tOtp',
      token: 'mocked-token',
      email: 'test@example.com',
      password: 'password123',
    }

    await registerUser(req, res)

    expect(utils.generateSecretKey).toHaveBeenCalled()
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      secretKey: 'mocked-secret-key',
      type: 'register',
    })

    expect(utils.verifyTotp).toHaveBeenCalledWith('mocked-tOtp', 'mocked-secret-key')
    expect(utils.createPasswordHash).toHaveBeenCalledWith('password123')
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'mocked-jwt-token',
        googleAuthSetup: {
          secretKey: 'mocked-secret-key',
        },
      },
      notice: ['Google Authenticator setup required.'],
    })

    // Ensure services functions are called correctly
    expect(services.createUser).toHaveBeenCalledWith(
      {
        'id': 'mocked-user-id',
        'email': 'test@example.com',
        'password': 'mocked-hash-password',
        'secret-key': 'mocked-secret-key',
        'status': 'active',
      },
      'mocked-user-id',
    )
    expect(services.addAuthHistory).toHaveBeenCalledWith('mocked-user-id', 'register')
  })

  // Add more test cases for other scenarios

  it('should handle error case', async () => {
    // Mocking an error thrown by a function

    jest.spyOn(utils, 'generateSecretKey').mockImplementationOnce(() => {
      throw new Error('Mocked error')
    })
    // utils.generateSecretKey.mockImplementationOnce(() => {
    //   throw new Error('Mocked error')
    // })

    await registerUser(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      success: false,
      errors: { error: 'Mocked error' },
      notice: ['Error occurred while executing the register function.'],
      statusCode: 500,
    })
  })
})
