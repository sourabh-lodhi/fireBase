export const middleware = async (req, res, middlewares) => {
  let index = 0
  let headersSent = false

  const originalSetHeader = res.setHeader
  res.setHeader = function (...args) {
    if (!headersSent) {
      originalSetHeader.apply(res, args)
    }
  }

  const next = async () => {
    if (index < middlewares.length && !headersSent) {
      await middlewares[index++](req, res, next)
    }
  }

  const originalSend = res.send
  res.send = function (...args) {
    if (!headersSent) {
      headersSent = true
      originalSend.apply(res, args)
    }
  }

  // eslint-disable-next-line no-unmodified-loop-condition
  while (index < middlewares.length && !headersSent) {
    await next()
  }
}
