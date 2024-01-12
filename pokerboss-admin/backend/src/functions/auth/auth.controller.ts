import { auth as authentication, firestore } from 'firebase-admin'
import * as services from '../../services'
import * as utils from '../../utils'
const adminAuth = authentication()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY)

/**
 * This function is used for the register the user
 */

export const registerUser = async (req, res) => {
  try {
    /**
     * get email, password, totp, token and device id from request body
     */
    const { email, password, tOtp, token } = req.body

    if ((email && !password) || (!email && password)) {
      /**
       * Check if both email and password are present or both are missing
       * If not, send a response indicating that email and password
       * are required
       */
      utils.restFormResponseHandler({
        res,
        success: false,
        errors: { error: ['email and password are required'] },
        notice: ['Validation error'],
        statusCode: 400,
      })
    }

    if ((token && !tOtp) || (!token && tOtp)) {
      /**
       * Check if both token and totp are present or both are missing
       * If not, send a response indicating that token and totp are required
       */
      utils.restFormResponseHandler({
        res,
        success: false,
        errors: { error: ['token and totp are required'] },
        notice: ['Validation error'],
        statusCode: 400,
      })
    }

    if (email && password) {
      // If email and password are provided
      const user = await services.findUsers([
        {
          field: 'email',
          operator: '==',
          value: email,
        },
      ])

      if (user.length > 0) {
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['Email already exists'],
          statusCode: 400,
        })
      } else {
        // /**
        //  * Create a secret key for the authenticator app
        //  */
        const secretKey = utils.generateSecretKey()
        const token = utils.generateJWTToken({ email, password, secretKey, type: 'register' })
        utils.restFormResponseHandler({
          res,
          statusCode: 200,
          success: true,
          values: {
            token,
            googleAuthSetup: {
              secretKey: secretKey,
            },
          },
          notice: ['Google Authenticator setup required.'],
        })
      }
    } else if (token && tOtp) {
      // If token and totp are provided
      const { email, password, secretKey, type }: any = utils.verifyJWTToken(token)
      if (type !== 'register') {
        /**
         * If the token type is not 'login'
         * Send a response indicating an invalid token
         */
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['Invalid token'],
          statusCode: 403,
        })
      }

      const verifiedResult = utils.verifyTotp(tOtp, secretKey)
      if (verifiedResult) {
        /**
         * Create password hash
         */
        const hashPassword = await utils.createPasswordHash(password)
        /**
         * Create admin user in firebase admin
         */
        const userRecord = await adminAuth.createUser({
          email,
          password,
        })
        /**
         * Create user instance
         */
        const user: services.UserType = {
          'id': userRecord?.uid,
          email,
          'password': hashPassword,
          'secret-key': secretKey,
          'status': 'active',
        }

        /**
         * Create a user and get th same
         */
        const result = await services.createUser(user, userRecord?.uid)
        /**
         * update auth history
         */
        services.addAuthHistory(result.id, 'register')

        // Send a response with the new token indicating successful verification
        utils.restFormResponseHandler({
          res,
          statusCode: 200,
          success: true,
          values: { token },
          notice: ['Verification successful'],
        })
      } else {
        /**
         * If the totp verification fails
         * Send a response indicating an invalid totp
         */
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['Invalid totp'],
          statusCode: 400,
        })
      }
    } else {
      /**
       * If the request is invalid or incomplete
       * Send a response indicating an invalid request
       */
      utils.restFormResponseHandler({
        res,
        success: false,
        notice: ['Invalid request'],
        statusCode: 400,
      })
    }
  } catch (error) {
    utils.restFormResponseHandler({
      res,
      success: false,
      errors: { error: error?.message },
      notice: ['Error occurred while executing the register function.'],
      statusCode: 500,
    })
  }
}

export const userLogin = async (req, res) => {
  try {
    /**
     * get email, password, totp, token from request body
     */
    const { email, password, tOtp, token } = req.body

    if ((email && !password) || (!email && password)) {
      /**
       * Check if both email and password are present or both are missing
       * If not, send a response indicating that email and password
       * are required
       */
      utils.restFormResponseHandler({
        res,
        success: false,
        errors: { error: ['email and password are required'] },
        notice: ['Validation error'],
        statusCode: 400,
      })
    }

    if ((token && !tOtp) || (!token && tOtp)) {
      /**
       * Check if both token and totp are present or both are missing
       * If not, send a response indicating that token and totp are required
       */
      utils.restFormResponseHandler({
        res,
        success: false,
        errors: { error: ['token and totp are required'] },
        notice: ['Validation error'],
        statusCode: 400,
      })
    }

    if (email && password) {
      // If email and password are provided
      const user = await services.findUsers([
        {
          field: 'email',
          operator: '==',
          value: email,
        },
      ])
      if (!user.length) {
        /**
         * If no user is found with the provided email
         * Send a response indicating invalid credentials
         */
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['Invalid credentials'],
          statusCode: 400,
        })
      } else {
        /**
         * If user is found, compare the provided password
           with the stored password
         */

        const isValid = await utils.comparePassword(password, user[0].password)

        if (!isValid) {
          /**
           * If the password is not valid
           * Send a response indicating invalid credentials
           */
          utils.restFormResponseHandler({
            res,
            success: false,
            notice: ['Invalid credentials'],
            statusCode: 400,
          })
        } else {
          // If the password is valid, generate a JWT token for authentication
          const token = utils.generateJWTToken({
            email,
            type: 'login',
          })
          /* Send a response with the generated token indicating
          successful authentication
          */
          utils.restFormResponseHandler({
            res,
            success: true,
            values: {
              token,
            },
            notice: ['Authentication required'],
            statusCode: 200,
          })
        }
      }
    } else if (token && tOtp) {
      // If token and totp are provided
      const { email, type }: any = utils.verifyJWTToken(token)
      if (type !== 'login') {
        /**
         * If the token type is not 'login'
         * Send a response indicating an invalid token
         */
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['Invalid token'],
          statusCode: 403,
        })
      }

      const user = await services.findUsers([
        {
          field: 'email',
          operator: '==',
          value: email,
        },
      ])
      const doc = user[0]

      const verifiedResult = utils.verifyTotp(tOtp, doc['secret-key'])
      if (verifiedResult) {
        /* If the totp verification is successful,
        generate a new token for authentication
        */
        const token = utils.generateJWTToken({
          uid: doc.id,
          type: 'auth',
        })
        // Add the authentication history
        services.addAuthHistory(doc.id, 'login')

        // Send a response with the new token indicating successful verification
        utils.restFormResponseHandler({
          res,
          statusCode: 200,
          success: true,
          values: { token },
          notice: ['Verification successful'],
        })
      } else {
        /**
         * If the totp verification fails
         * Send a response indicating an invalid totp
         */
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['Invalid totp'],
          statusCode: 400,
        })
      }
    } else {
      /**
       * If the request is invalid or incomplete
       * Send a response indicating an invalid request
       */
      utils.restFormResponseHandler({
        res,
        success: false,
        notice: ['Invalid request'],
        statusCode: 400,
      })
    }
  } catch (error) {
    utils.restFormResponseHandler({
      res,
      success: false,
      errors: { error: error?.message },
      notice: ['Error occurred while executing the Login function.'],
      statusCode: 500,
    })
  }
}

export const reset = async (req, res) => {
  try {
    // Destructure request body properties
    const { email, emailOtp, newPassword, token } = req.body

    if (email) {
      // Find user based on email
      const user = await services.findUsers([
        {
          field: 'email',
          operator: '==',
          value: email,
        },
      ])

      if (!user.length) {
        // email does not exist, send appropriate response
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['email does not exist'],
          statusCode: 401,
        })
      } else {
        const record = user[0]
        const otp = utils.generateOTP()

        const msg = {
          // to: record.email, // Change to your recipient
          to: 'aayush.c@in.geekyants.com',
          from: 'aayushtw325@gmail.com', // Change to your verified sender
          subject: 'OTP For Password Reset ',
          text: 'Poker Boss Password Reset',
          html: `<strong>This is your OTP ${otp} for password reset.</strong>`,
        }

        const mailsent = await sgMail.send(msg)
        const [response] = mailsent
        const token = utils.generateJWTToken({
          uid: record.id,
          type: 'reset-token',
          otp: await utils.createPasswordHash(otp.toString()),
        })

        if (response.statusCode === 202) {
          utils.restFormResponseHandler({
            res,
            success: true,
            values: { token },
            notice: ['A otp has been sent to your registered email'],
            statusCode: 200,
          })
        } else {
          utils.restFormResponseHandler({
            res,
            success: false,
            notice: ['Error sending OTP via email'],
            statusCode: 401,
          })
        }
      }
    } else if (emailOtp && token) {
      const decodedToken: any = utils.verifyJWTToken(token)

      if (await utils.comparePassword(emailOtp, decodedToken.otp)) {
        utils.restFormResponseHandler({
          res,
          success: true,
          values: { token },
          notice: ['OTP Verified Successfully'],
          statusCode: 200,
        })
      } else {
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['Invalid OTP'],
          statusCode: 401,
        })
      }
    } else if (newPassword && token) {
      const { uid, type }: any = utils.verifyJWTToken(token)

      if (type !== 'reset-token') {
        // Invalid token type, send appropriate response
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['Invalid token'],
          statusCode: 403,
        })
      } else {
        // Hash the password
        const hashPassword = await utils.createPasswordHash(newPassword)

        // Update user data with the new password
        await services.updateUserData(uid, {
          password: hashPassword,
        })
        await adminAuth.updateUser(uid, {
          password: hashPassword,
        })

        // Add authentication history
        services.addAuthHistory(uid, 'changepassword')

        // Send successful response
        utils.restFormResponseHandler({
          res,
          success: true,
          statusCode: 200,
          notice: ['New password created successfully'],
        })
      }
    } else {
      /**
       * If the request is invalid or incomplete
       * Send a response indicating an invalid request
       */
      utils.restFormResponseHandler({
        res,
        success: false,
        notice: ['Invalid request'],
        statusCode: 400,
      })
    }
  } catch (error) {
    // Handle any errors that occur during the execution
    utils.restFormResponseHandler({
      res,
      success: false,
      errors: { error: error?.message },
      notice: ['Error occurred while executing the Reset function.'],
      statusCode: 500,
    })
  }
}
