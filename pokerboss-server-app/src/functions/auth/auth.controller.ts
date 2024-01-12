import * as services from '../../services'
import * as utils from '../../utils'
import { getAuth } from 'firebase-admin/auth'
import { Request, Response } from 'firebase-functions'

export const sso = async (req, res) => {
  try {
    const { 'firebase-token': firebaseToken, 'device-id': deviceId } = req.body

    const authPayload = await getAuth().verifyIdToken(firebaseToken)
    if (authPayload) {
      req.body = {
        ...req.body,
        email: authPayload?.email,
        phone: authPayload?.phone_number,
        type: 'sso:' + authPayload.firebase.sign_in_provider.split('.')[0],
      }
      const emailorphone = authPayload?.email ? 'email' : 'phone'

      const user = await services.findUsers([
        {
          field: 'device-id',
          operator: '==',
          value: deviceId,
        },
        {
          field: 'status',
          operator: '==',
          value: 'active',
        },
        {
          field: 'type',
          operator: '==',
          value: req.body.type,
        },
        {
          field: emailorphone,
          operator: '==',
          value: req.body[emailorphone],
        },
      ])

      let token
      let notice

      if (user.length) {
        token = utils.generateJWTToken({ uid: user[0].id, type: 'auth' })
        services.addAuthHistory(user[0].id, deviceId, 'login')
        notice = 'Successfully signed in.'
      } else {
        const userPayload: services.UserType = {
          [emailorphone]: req.body[emailorphone],
          'status': 'active',
          'notice': 'Created new account.',
          'device-id': deviceId,
          'type': req.body.type,
        }
        const result = await services.createUser(userPayload)

        services.addAuthHistory(result.id, deviceId, 'register')

        token = utils.generateJWTToken({ uid: result.id, type: 'auth' })
        notice = 'Successfully created a new user account.'
      }

      utils.restFormResponseHandler({
        res,
        statusCode: 200,
        success: true,
        values: {
          token,
        },
        notice: [notice],
      })
    }
  } catch (error) {
    utils.restFormResponseHandler({
      res,
      success: false,
      errors: { error: error?.message },
      notice: ['Error occurred while executing the SSO function.'],
      statusCode: 500,
    })
  }
}

export const otp = async (req: Request, res: Response) => {
  try {
    const { email, phone, token, otp, 'device-id': deviceId } = req.body

    if (!phone && !email) {
      /**
       * Check if both of phone & email are missing
       * If not, send a response indicating that phone or email
       * are required
       */
      utils.restFormResponseHandler({
        res,
        success: false,
        errors: { error: ['Phone or email is required'] },
        notice: ['Validation error'],
        statusCode: 400,
      })
    }

    if (!token) {
      const param: services.FindUserByKeyArgs[] = [
        {
          field: 'device-id',
          operator: '==',
          value: deviceId.toString(),
        },
      ]
      if (email) {
        param.push({
          field: 'email',
          operator: '==',
          value: email,
        })
      } else {
        param.push({
          field: 'phone',
          operator: '==',
          value: phone,
        })
      }

      const user = await services.findUsers(param)
      let userPayload: services.UserType
      let flow
      if (user.length) {
        // Login
        flow = 'login'
        userPayload = user[0]
      } else {
        // Register

        flow = 'register'
        userPayload = {
          'email': email || undefined,
          'phone': phone || undefined,
          'device-id': deviceId,
          'status': 'unverified',
          'type': email ? 'email' : 'phone',
        }
      }

      // send OTP
      const otp = utils.generateOTP()
      if (email) {
        await utils.sendOTPViaEmail()
      } else {
        await utils.sendOTPViaSMS(phone, otp)
      }

      const token = utils.generateJWTToken({
        type: 'verify-otp',
        user: userPayload,
        flow,
        otp: await utils.createPasswordHash(otp.toString()),
      })
      utils.restFormResponseHandler({
        res,
        success: true,
        values: {
          token,
        },
        notice: [`please provide otp to ${flow}`],
        statusCode: 200,
      })
    } else {
      const decodedToken: any = utils.verifyJWTToken(token)

      if (decodedToken.type === 'verify-otp' && decodedToken.user && utils.comparePassword(otp, decodedToken.otp)) {
        if (decodedToken.flow === 'register') {
          // setup 2fa
          const userPayload = {
            ...decodedToken.user,
            status: '2fa-setup',
          }

          const token = utils.generateJWTToken({
            type: 'setup-2fa',
            user: userPayload,
            flow: decodedToken.flow,
          })

          utils.restFormResponseHandler({
            res,
            success: true,
            values: {
              token,
            },
            notice: [`please setup 2fa for ${decodedToken.flow}`],
            statusCode: 200,
          })
        } else {
          const otp = utils.generateOTP()
          const twoFA = decodedToken.user['2fa'].split(':')
          if (twoFA[0] === 'email:') {
            await utils.sendOTPViaEmail()
          } else {
            await utils.sendOTPViaSMS(twoFA[2], otp)
          }

          const token = utils.generateJWTToken({
            type: 'verify-2fa',
            user: decodedToken.user,
            flow: decodedToken.flow,
            otp: await utils.createPasswordHash(otp.toString()),
          })

          utils.restFormResponseHandler({
            res,
            success: true,
            values: {
              token,
            },
            notice: [`please verify 2fa for ${decodedToken.flow}`],
            statusCode: 200,
          })
        }
      } else {
        utils.restFormResponseHandler({
          res,
          success: false,
          errors: { error: ['invalid OTP'] },
          notice: ['Error occurred while executing the otp function.'],
          statusCode: 500,
        })
      }
    }
  } catch (error) {
    utils.restFormResponseHandler({
      res,
      success: false,
      errors: { error: error?.message },
      notice: ['Error occurred while executing the otp function.'],
      statusCode: 500,
    })
  }
}

export const register = async (req, res) => {
  try {
    /**
     * get username, password, totp, token and device id from request body
     */
    const { username, password, totp, token, 'device-id': deviceId } = req.body
    if ((username && !password) || (!username && password)) {
      /**
       * Check if both username and password are present or both are missing
       * If not, send a response indicating that username and password
       * are required
       */
      utils.restFormResponseHandler({
        res,
        success: false,
        errors: { error: ['username and password are required'] },
        notice: ['Validation error'],
        statusCode: 400,
      })
    }

    if ((token && !totp) || (!token && totp)) {
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

    if (username && password) {
      // If username and password are provided
      const user = await services.findUsers([
        {
          field: 'username',
          operator: '==',
          value: username,
        },
        {
          field: 'device-id',
          operator: '==',
          value: deviceId,
        },
      ])

      if (user.length > 0) {
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['Username already exists'],
          statusCode: 400,
        })
      } else {
        // /**
        //  * Create a secret key for the authenticator app
        //  */
        const secretKey = utils.generateSecretKey()
        const token = utils.generateJWTToken({ username, password, secretKey, type: 'register' })
        utils.restFormResponseHandler({
          res,
          statusCode: 200,
          success: true,
          values: {
            token,
            'google-auth-setup': {
              'secret-key': secretKey,
            },
          },
          notice: ['Google Authenticator setup required.'],
        })
      }
    } else if (token && totp) {
      // If token and totp are provided
      const { username, password, secretKey, type }: any = utils.verifyJWTToken(token)
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

      const verifiedResult = utils.verifyTotp(totp, secretKey)
      if (verifiedResult) {
        /**
         * Create password hash
         */
        const hashPassword = await utils.createPasswordHash(password)
        /**
         * Create user instance
         */
        const user: services.UserType = {
          username,
          'password': hashPassword,
          'device-id': deviceId,
          'secret-key': secretKey,
          'status': 'active',
          'type': 'username',
        }
        /**
         * Create a user and get th same
         */
        const result = await services.createUser(user)
        /**
         * update auth history
         */
        services.addAuthHistory(result.id, deviceId, 'register')

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

export const login = async (req, res) => {
  try {
    /**
     * get username, password, totp, token and device id from request body
     */
    const { username, password, totp, token, 'device-id': deviceId } = req.body

    if ((username && !password) || (!username && password)) {
      /**
       * Check if both username and password are present or both are missing
       * If not, send a response indicating that username and password
       * are required
       */
      utils.restFormResponseHandler({
        res,
        success: false,
        errors: { error: ['username and password are required'] },
        notice: ['Validation error'],
        statusCode: 400,
      })
    }

    if ((token && !totp) || (!token && totp)) {
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

    if (username && password) {
      // If username and password are provided
      const user = await services.findUsers([
        {
          field: 'username',
          operator: '==',
          value: username,
        },
        {
          field: 'device-id',
          operator: '==',
          value: deviceId,
        },
      ])
      if (!user.length) {
        /**
         * If no user is found with the provided username and device ID
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
        const isValid = utils.comparePassword(password, user[0].password)
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
            username,
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
    } else if (token && totp) {
      // If token and totp are provided
      const { username, type }: any = utils.verifyJWTToken(token)
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
          field: 'username',
          operator: '==',
          value: username,
        },
        {
          field: 'device-id',
          operator: '==',
          value: deviceId,
        },
      ])
      const doc = user[0]

      const verifiedResult = utils.verifyTotp(totp, doc['secret-key'])
      if (verifiedResult) {
        /* If the totp verification is successful,
        generate a new token for authentication
        */
        const token = utils.generateJWTToken({
          uid: doc.id,
          type: 'auth',
        })
        // Add the authentication history
        services.addAuthHistory(doc.id, deviceId, 'login')

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
    const { username, totp, 'device-id': deviceId, password, token } = req.body

    if (username && totp) {
      // Find user based on username and device ID
      const user = await services.findUsers([
        {
          field: 'username',
          operator: '==',
          value: username,
        },
        {
          field: 'device-id',
          operator: '==',
          value: deviceId,
        },
      ])

      if (!user.length) {
        // Username does not exist, send appropriate response
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['Username does not exist'],
          statusCode: 401,
        })
      } else {
        const record = user[0]
        // Verify the provided TOTP against the user's secret key
        const verifiedResult = utils.verifyTotp(totp, record['secret-key'])

        if (!verifiedResult) {
          // Invalid OTP, send appropriate response
          utils.restFormResponseHandler({
            res,
            success: false,
            notice: ['Invalid OTP'],
            statusCode: 401,
          })
        } else {
          // Generate JWT token
          const token = utils.generateJWTToken({
            uid: record.id,
            type: 'reset-token',
          })

          // Send successful response with token
          utils.restFormResponseHandler({
            res,
            success: true,
            values: { token },
            notice: ['Verified'],
            statusCode: 200,
          })
        }
      }
    } else if (token && username && password) {
      // Find user based on username and device ID
      const user = await services.findUsers([
        {
          field: 'username',
          operator: '==',
          value: username,
        },
        {
          field: 'device-id',
          operator: '==',
          value: deviceId,
        },
      ])

      if (!user.length) {
        // User does not exist, send appropriate response
        utils.restFormResponseHandler({
          res,
          success: false,
          notice: ['User does not exist'],
          statusCode: 401,
        })
      } else {
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
          const hashPassword = await utils.createPasswordHash(password)

          // Update user data with the new password
          await services.updateUserData(uid, {
            password: hashPassword,
          })

          // Add authentication history
          services.addAuthHistory(uid, deviceId, 'changepassword')

          // Send successful response
          utils.restFormResponseHandler({
            res,
            success: true,
            statusCode: 200,
            notice: ['New password created successfully. Please continue to login'],
          })
        }
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

export const auth2FA = async (req: Request, res: Response) => {
  try {
    const { email, phone, otp, token, 'device-id': deviceId } = req.body

    if ((email || phone) && token) {
      const decodedToken: any = await utils.verifyJWTToken(token)

      if (decodedToken.type === 'setup-2fa' && decodedToken.user) {
        if ((decodedToken.user.type === 'email' && phone) || (decodedToken.user.type === 'phone' && email)) {
          const twoFA = email ? `email:${email}` : `phone:${phone}`
          const userPayload = {
            ...decodedToken.user,
            '2fa': twoFA,
          }

          const otp = utils.generateOTP()
          if (email) {
            await utils.sendOTPViaEmail()
          } else {
            await utils.sendOTPViaSMS(phone, otp)
          }

          const token = utils.generateJWTToken({
            type: 'verify-2fa',
            user: userPayload,
            flow: decodedToken.flow,
            otp: await utils.createPasswordHash(otp.toString()),
          })

          utils.restFormResponseHandler({
            res,
            success: true,
            values: {
              token,
            },
            notice: [`please verify 2fa for ${decodedToken.flow}`],
            statusCode: 200,
          })
        } else {
          utils.restFormResponseHandler({
            res,
            success: false,
            errors: { error: ['if registeration is with email then 2fa should be with phone and vice versa'] },
            notice: ['Error occurred while executing the auth2FA function.'],
            statusCode: 500,
          })
        }
      }
    } else if (otp && token) {
      const decodedToken: any = await utils.verifyJWTToken(token)

      if (decodedToken.type === 'verify-otp' && decodedToken.user && utils.comparePassword(otp, decodedToken.otp)) {
        if (decodedToken.flow === 'register') {
          // setup 2fa
          const userPayload = {
            ...decodedToken.user,
            status: '2fa-setup',
          }

          const token = utils.generateJWTToken({
            type: 'setup-2fa',
            user: userPayload,
            flow: decodedToken.flow,
          })

          utils.restFormResponseHandler({
            res,
            success: true,
            values: {
              token,
            },
            notice: [`please setup 2fa for ${decodedToken.flow}`],
            statusCode: 200,
          })
        } else {
          const otp = utils.generateOTP()
          const twoFA = decodedToken.user['2fa'].split(':')
          if (twoFA[0] === 'email:') {
            await utils.sendOTPViaEmail()
          } else {
            await utils.sendOTPViaSMS(twoFA[2], otp)
          }

          const token = utils.generateJWTToken({
            type: 'verify-2fa',
            user: decodedToken.user,
            flow: decodedToken.flow,
            otp: await utils.createPasswordHash(otp.toString()),
          })

          utils.restFormResponseHandler({
            res,
            success: true,
            values: {
              token,
            },
            notice: [`please verify 2fa for ${decodedToken.flow}`],
            statusCode: 200,
          })
        }
      } else if (
        decodedToken.type === 'verify-2fa' &&
        decodedToken.user &&
        utils.comparePassword(otp, decodedToken.otp)
      ) {
        // incorrect password
        if (decodedToken.flow === 'register') {
          // create new account
          decodedToken.user.status = 'active'
          decodedToken.user['device-id'] = deviceId
          const result = await services.createUser(decodedToken.user)
          /**
           * update auth history
           */
          services.addAuthHistory(result.id, deviceId, 'register')

          // generate auth token
          const token = utils.generateJWTToken({ uid: result.id, type: 'auth' })

          utils.restFormResponseHandler({
            res,
            statusCode: 200,
            success: true,
            values: {
              token,
            },
            notice: ['Regiseration successful'],
          })
        } else {
          const token = utils.generateJWTToken({
            uid: decodedToken.user.id,
            type: 'auth',
          })
          // Add the authentication history
          services.addAuthHistory(decodedToken.user.id, deviceId, 'login')

          // Send a response with the new token indicating successful verification
          utils.restFormResponseHandler({
            res,
            statusCode: 200,
            success: true,
            values: { token },
            notice: ['Verification successful'],
          })
        }
      } else {
        utils.restFormResponseHandler({
          res,
          success: false,
          errors: { error: ['invalid OTP'] },
          notice: ['Error occurred while executing the auth2FA function.'],
          statusCode: 500,
        })
      }
    }
  } catch (error) {
    utils.restFormResponseHandler({
      res,
      success: false,
      errors: { error: error?.message },
      notice: ['Error occurred while executing the auth2FA function.'],
      statusCode: 500,
    })
  }
}
