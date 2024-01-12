import { validateSchema } from '../validation.handler'

describe('validateSchema', () => {
  let req; let res; let next; let schema

  beforeEach(() => {
    req = {
      body: {},
    }
    res = {
      status: jest.fn(() => ({ json: jest.fn() })),
    }
    next = jest.fn()
    schema = {
      validate: jest.fn(() => ({ error: null })),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Validation passes, proceed to next middleware', async () => {
    await validateSchema(schema)(req, res, next)

    expect(schema.validate).toHaveBeenCalledWith(req.body)
    expect(next).toHaveBeenCalled()
  })

  test('Validation fails, returns error response', async () => {
    const validationError = new Error('Validation error')
    schema.validate.mockReturnValueOnce({ error: validationError })

    await validateSchema(schema)(req, res, next)

    expect(schema.validate).toHaveBeenCalledWith(req.body)
    expect(next).not.toHaveBeenCalled()
  })

  test('Converts Joi validation error into ErrorType format', async () => {
    const validationError = {
      error: {
        details: [
          { path: ['field1'], message: '"field1" is required' },
          { path: ['field2'], message: '"field2" must be a string' },
          { path: ['field2', 'nested'], message: '"nested" is required' },
        ],
      },
    }
    schema.validate.mockReturnValueOnce(validationError)

    await validateSchema(schema)(req, res, next)

    expect(schema.validate).toHaveBeenCalledWith(req.body)
    expect(next).not.toHaveBeenCalled()
  })
})
