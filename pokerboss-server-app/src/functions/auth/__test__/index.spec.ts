import * as test from 'firebase-functions-test'
import admin from 'firebase-admin'
import * as authController from '../auth.controller'
import * as middleware from '../../../middlewares'
import * as validateSchema from '../../../handlers/validation.handler'
import * as middlewareHandler from '../../../handlers/middleware.handler'

import * as schemas from '../auth.schema'
import * as restFormResponseHandler from '../../../utils/rest-form.util'
import { Request, Response } from 'firebase-functions'
import { sso, register, login, reset, twoFA } from '../index'

admin.initializeApp()
const firebaseTest = test.default()


jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn(),
  }),
}))

describe('sso function', () => {
  afterEach(() => {
    // Reset the mocks
    firebaseTest.cleanup()
  })

  it('should call the middleware handler with the correct parameters', async () => {
    const mockRequest = {} as unknown as Request
    const mockResponse = {} as unknown as Response

    mockResponse.json = jest.fn()
    mockResponse.status = jest.fn(() => mockResponse)
    const mockCheckHttpMethod = jest.spyOn(middleware, 'checkHttpMethod')
    const mockValidateSchema = jest.spyOn(validateSchema, 'validateSchema')
    const mockSso = jest.spyOn(authController, 'sso')
    const mockMiddleware = jest.spyOn(middlewareHandler, 'middleware')

    await sso(mockRequest, mockResponse)

    expect(mockCheckHttpMethod).toHaveBeenCalled()
    expect(mockValidateSchema).toHaveBeenCalledWith(schemas.authSSO)
    expect(mockMiddleware).toHaveBeenCalledWith(mockRequest, mockResponse, expect.any(Array))

    mockCheckHttpMethod.mockRestore()
    mockValidateSchema.mockRestore()
    mockSso.mockRestore()
    mockMiddleware.mockRestore()
  })

  it('should call the restFormResponseHandler with an error message on exception', async () => {
    const mockRequest = {} as unknown as Request
    const mockResponse = {} as unknown as Response

    mockResponse.json = jest.fn()
    mockResponse.status = jest.fn(() => mockResponse)
    const mockRestFormResponseHandler = jest.spyOn(restFormResponseHandler, 'restFormResponseHandler')
    const mockMiddleware = jest.spyOn(middlewareHandler, 'middleware')

    const error = new Error('Something went wrong')

    mockMiddleware.mockImplementation(() => {
      throw error
    })

    await sso(mockRequest, mockResponse)

    expect(mockRestFormResponseHandler).toHaveBeenCalledWith({
      res: mockResponse,
      success: false,
      statusCode: 500,
      notice: ['Something went wrong while executing auth-sso function'],
    })

    mockRestFormResponseHandler.mockRestore()
    mockMiddleware.mockRestore()
  })
})

describe('register function', () => {
  afterEach(() => {
    // Reset the mocks
    firebaseTest.cleanup()
  })

  it('should call the middleware handler with the correct parameters', async () => {
    const mockRequest = {} as unknown as Request
    const mockResponse = {} as unknown as Response

    mockResponse.json = jest.fn()
    mockResponse.status = jest.fn(() => mockResponse)
    const mockCheckHttpMethod = jest.spyOn(middleware, 'checkHttpMethod')
    const mockValidateSchema = jest.spyOn(validateSchema, 'validateSchema')
    const mockRegister = jest.spyOn(authController, 'register')
    const mockMiddleware = jest.spyOn(middlewareHandler, 'middleware')

    await register(mockRequest, mockResponse)

    expect(mockCheckHttpMethod).toHaveBeenCalled()
    expect(mockValidateSchema).toHaveBeenCalledWith(schemas.authRegister)
    expect(mockMiddleware).toHaveBeenCalledWith(mockRequest, mockResponse, expect.any(Array))

    mockCheckHttpMethod.mockRestore()
    mockValidateSchema.mockRestore()
    mockRegister.mockRestore()
    mockMiddleware.mockRestore()
  })
})

describe('login function', () => {
  afterEach(() => {
    // Reset the mocks
    firebaseTest.cleanup()
  })

  it('should call the middleware handler with the correct parameters', async () => {
    const mockRequest = {} as unknown as Request
    const mockResponse = {} as unknown as Response

    mockResponse.json = jest.fn()
    mockResponse.status = jest.fn(() => mockResponse)
    const mockCheckHttpMethod = jest.spyOn(middleware, 'checkHttpMethod')
    const mockValidateSchema = jest.spyOn(validateSchema, 'validateSchema')
    const mockRegister = jest.spyOn(authController, 'login')
    const mockMiddleware = jest.spyOn(middlewareHandler, 'middleware')

    await login(mockRequest, mockResponse)

    expect(mockCheckHttpMethod).toHaveBeenCalled()
    expect(mockValidateSchema).toHaveBeenCalledWith(schemas.authLogin)
    expect(mockMiddleware).toHaveBeenCalledWith(mockRequest, mockResponse, expect.any(Array))

    mockCheckHttpMethod.mockRestore()
    mockValidateSchema.mockRestore()
    mockRegister.mockRestore()
    mockMiddleware.mockRestore()
  })
})

describe('reset function', () => {
  afterEach(() => {
    // Reset the mocks
    firebaseTest.cleanup()
  })

  it('should call the middleware handler with the correct parameters', async () => {
    const mockRequest = {} as unknown as Request
    const mockResponse = {} as unknown as Response

    mockResponse.json = jest.fn()
    mockResponse.status = jest.fn(() => mockResponse)
    const mockCheckHttpMethod = jest.spyOn(middleware, 'checkHttpMethod')
    const mockValidateSchema = jest.spyOn(validateSchema, 'validateSchema')
    const mockReset = jest.spyOn(authController, 'reset')
    const mockMiddleware = jest.spyOn(middlewareHandler, 'middleware')

    await reset(mockRequest, mockResponse)

    expect(mockCheckHttpMethod).toHaveBeenCalled()
    expect(mockValidateSchema).toHaveBeenCalledWith(schemas.authReset)
    expect(mockMiddleware).toHaveBeenCalledWith(mockRequest, mockResponse, expect.any(Array))

    mockCheckHttpMethod.mockRestore()
    mockValidateSchema.mockRestore()
    mockReset.mockRestore()
    mockMiddleware.mockRestore()
  })
})

describe('auth2FA function', () => {
  afterEach(() => {
    // Reset the mocks
    firebaseTest.cleanup()
  })

  it('should call the middleware handler with the correct parameters', async () => {
    const mockRequest = {} as unknown as Request
    const mockResponse = {} as unknown as Response

    mockResponse.json = jest.fn()
    mockResponse.status = jest.fn(() => mockResponse)
    const mockCheckHttpMethod = jest.spyOn(middleware, 'checkHttpMethod')
    const mockValidateSchema = jest.spyOn(validateSchema, 'validateSchema')
    const mockReset = jest.spyOn(authController, 'reset')
    const mockMiddleware = jest.spyOn(middlewareHandler, 'middleware')

    await twoFA(mockRequest, mockResponse)

    expect(mockCheckHttpMethod).toHaveBeenCalled()
    expect(mockValidateSchema).toHaveBeenCalledWith(schemas.auth2FA)
    expect(mockMiddleware).toHaveBeenCalledWith(mockRequest, mockResponse, expect.any(Array))

    mockCheckHttpMethod.mockRestore()
    mockValidateSchema.mockRestore()
    mockReset.mockRestore()
    mockMiddleware.mockRestore()
  })
})
