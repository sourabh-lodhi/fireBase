import { Response } from 'firebase-functions'
import * as util from '../rest-form.util'

describe('restFormResponseHandler', () => {
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

  test(`should respond with the 
    correct data for a successful response`, () => {
    const functionParams = {
      res: mockResponse,
      success: true,
      values: { name: 'Rajat pillai', age: 27 },
      errors: {},
      notice: ['Success!'],
      statusCode: 200,
    }

    util.restFormResponseHandler(functionParams)

    const expectedResponse = {
      ok: true,
      status: 200,
      data: {
        values: { name: 'Rajat pillai', age: 27 },
        errors: {},
        notice: ['Success!'],
      },
    }

    expect(mockStatus).toHaveBeenCalledWith(200)
    expect(mockJson).toHaveBeenCalledWith(expectedResponse)
  })

  test(`should respond with the correct 
     data for an unsuccessful response`, () => {
    const functionParams = {
      res: mockResponse,
      success: false,
      values: {},
      errors: { username: ['Username already exists'] },
      notice: ['Error!'],
      statusCode: 400,
    }

    util.restFormResponseHandler(functionParams)

    const expectedResponse = {
      ok: false,
      status: 400,
      data: {
        values: {},
        errors: { username: ['Username already exists'] },
        notice: ['Error!'],
      },
    }

    expect(mockStatus).toHaveBeenCalledWith(400)
    expect(mockJson).toHaveBeenCalledWith(expectedResponse)
  })
})
