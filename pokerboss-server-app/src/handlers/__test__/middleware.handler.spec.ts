import { middleware } from '../middleware.handler'

describe('middleware', () => {
  test('should call middlewares in order and handle response', async () => {
    const req = {}
    const res = {
      setHeader: jest.fn(),
      send: jest.fn(),
    }

    const middleware1 = jest.fn((req, res, next) => next())
    const middleware2 = jest.fn((req, res, next) => next())
    const middleware3 = jest.fn((req, res, next) => next())
    const middleware4 = jest.fn((req, res, next) => next())

    const middlewares = [middleware1, middleware2, middleware3, middleware4]

    await middleware(req, res, middlewares)

    expect(middleware1).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(middleware2).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(middleware3).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(middleware4).toHaveBeenCalledWith(req, res, expect.any(Function))
  })

  test('should stop calling middlewares once response is sent', async () => {
    const req = {}
    const res = {
      setHeader: jest.fn(),
      send: jest.fn(),
    }

    const middleware1 = jest.fn((req, res, next) => next())
    const middleware2 = jest.fn((req, res) => {
      res.send('Response')
    })
    const middleware3 = jest.fn((req, res, next) => next())

    const middlewares = [middleware1, middleware2, middleware3]

    await middleware(req, res, middlewares)

    expect(middleware1).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(middleware2).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(middleware3).not.toHaveBeenCalled()
  })
})
