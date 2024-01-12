import * as util from '../rest-list.util'
import { Request, Response } from 'firebase-functions/v1'

describe('restListRequestHandler', () => {
  test('should parse and validate query parameters correctly', () => {
    const mockRequest: Request = {
      query: {
        filter: 'active,email',
        sort: 'username,email',
        page: '2',
        size: '20',
      },
    } as unknown as Request

    const getRequestParams = util.restListRequestHandler(mockRequest)

    expect(getRequestParams.filter).toEqual(['active', 'email'])
    expect(getRequestParams.sort).toEqual(['username', 'email'])
    expect(getRequestParams.page).toBe(2)
    expect(getRequestParams.size).toBe(20)
  })

  test(`should default to empty arrays and default 
  page and size if query parameters are missing`, () => {
    const mockRequest: Request = {
      query: {},
    } as unknown as Request

    const getRequestParams = util.restListRequestHandler(mockRequest)

    expect(getRequestParams.filter).toEqual([])
    expect(getRequestParams.sort).toEqual([])
    expect(getRequestParams.page).toBe(1)
    expect(getRequestParams.size).toBe(10)
  })
})

describe('restListResponseHandler', () => {
  let mockResponse: Response
  let mockJson: jest.Mock
  let mockStatus: jest.Mock

  beforeEach(() => {
    mockJson = jest.fn()
    mockStatus = jest.fn().mockReturnValue({ json: mockJson })
    mockResponse = {
      status: mockStatus,
    } as unknown as Response
  })

  test('should respond with the correct data for a successful response', () => {
    const data = [
      { id: 1, name: 'Rajat Pillai' },
      { id: 2, name: 'Rajat' },
    ]
    const statusCode = 200

    util.restListResponseHandler(mockResponse, true, data, statusCode)

    const expectedResponse = {
      ok: true,
      status: statusCode,
      data,
    }

    expect(mockStatus).toHaveBeenCalledWith(statusCode)
    expect(mockJson).toHaveBeenCalledWith(expectedResponse)
  })

  test(`should respond with the correct 
  data for an unsuccessful response`, () => {
    const data: unknown[] = []
    const statusCode = 500

    util.restListResponseHandler(mockResponse, false, data, statusCode)

    const expectedResponse = {
      ok: false,
      status: statusCode,
      data,
    }

    expect(mockStatus).toHaveBeenCalledWith(statusCode)
    expect(mockJson).toHaveBeenCalledWith(expectedResponse)
  })
})
