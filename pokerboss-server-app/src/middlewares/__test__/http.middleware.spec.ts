import { Request, Response } from 'firebase-functions'
import { checkHttpMethod, HttpMethod } from '../http.middleware'
import * as util from '../../utils'

// Mock the required dependencies
jest.mock('../../utils', () => ({
  restFormResponseHandler: jest.fn(),
}))

describe('checkHttpMethod', () => {
  // mock request helper fn
  const mockRequest = (method: HttpMethod) => ({ method } as unknown as Request)

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response

  const mockNext = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call next() when the request method matches the given method', () => {
    const method = 'GET'
    const middleware = checkHttpMethod(method)
    const req = mockRequest(method)
    const res = mockResponse

    middleware(req, res, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })

  test.each(['PUT', 'POST', 'PATCH', 'DELETE'])(
      'should call util.restFormResponseHandler when request method is %s',
      (method) => {
        const middleware = checkHttpMethod('GET')
        const req = mockRequest(method as HttpMethod)
        const res = mockResponse

        middleware(req, res, mockNext)

        expect(mockNext).not.toHaveBeenCalled()

        // expect to return response with proper messages and status codes
        expect(util.restFormResponseHandler).toHaveBeenCalledWith(
            expect.objectContaining({
              success: false,
              statusCode: 401,
              notice: [`${method} Method Not Allowed`],
              errors: {},
            }),
        )
      },
  )

  test('should work correctly with optional next parameter when not provided', () => {
    const method = 'GET'
    const middleware = checkHttpMethod(method)
    const req = mockRequest(method)
    const res = mockResponse

    expect(() => middleware(req, res, undefined)).not.toThrow()
  })
})
