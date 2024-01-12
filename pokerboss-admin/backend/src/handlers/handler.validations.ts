import { Schema } from 'joi'
import * as util from '../utils'

// Middleware for schema validation
export const validateSchema = (schema: Schema) => {
  return async (req, res, next) => {
    try {
      // Validate the request body against the schema
      const validationResult = schema.validate(req.body)
      if (validationResult.error) {
        // Convert Joi validation error into ErrorType format
        const errorDetails = validationResult.error.details.reduce((acc, { path, message }) => {
          const field = path.join('.')
          if (!acc[field]) {
            acc[field] = []
          }

          acc[field || 'error'].push(message.replace(/"/g, ''))
          return acc
        }, {})

        return util.restFormResponseHandler({
          res,
          success: false,
          statusCode: 400,
          notice: ['Validation Error'],
          errors: errorDetails,
        })
      } else {
        // If validation passes, proceed to the next middleware
        await next()
      }
    } catch (error) {
      // If validation fails, send an error response
      return util.restFormResponseHandler({
        res,
        success: false,
        statusCode: 400,
        notice: ['Validation Error'],
        errors: {},
      })
    }
  }
}
