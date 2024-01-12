import admin from 'firebase-admin'
import * as services from '../../../services'
import * as utils from '../../../utils'
import { sso, register, login, reset, otp, auth2FA } from '../auth.controller'

jest.mock('../../../services', () => ({
  findUsers: jest.fn(),
  createUser: jest.fn(),
  updateUserData: jest.fn(),
  addAuthHistory: jest.fn(),
}))

jest.mock('../../../utils', () => ({
  restFormResponseHandler: jest.fn(),
  generateJWTToken: jest.fn(),
  verifyJWTToken: jest.fn(),
  verifyTotp: jest.fn(),
  comparePassword: jest.fn(),
  generateSecretKey: jest.fn(),
  createPasswordHash: jest.fn(),
  generateOTP: jest.fn(),
  sendOTPViaEmail: jest.fn(),
  sendOTPViaSMS: jest.fn(),
}))

jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      // Provide the necessary data to fulfill the test case scenarios
      email: 'test@example.com',
      phone_number: '+123456789',
      firebase: {
        sign_in_provider: 'provider.google.com',
      },
    }),
  })),
}))

describe('sso', () => {
  let req
  let res

  beforeEach(() => {
    req = {
      body: { 'firebase-token': 'firebaseToken', 'device-id': 'device123' },
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(() => {
    admin.initializeApp()
  })

  test('should validate request with correct request body', async () => {
    req.body = {}
    await sso(req, res)
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      success: false,
      errors: { error: expect.any(String) },
      notice: ['Error occurred while executing the SSO function.'],
      statusCode: 500,
    })
  })

  test('should validate request and sign in the user if it exists', async () => {
    const user = [{ id: 'userId123' }]
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('authToken123')
    ;(services.addAuthHistory as jest.Mock).mockResolvedValue('userId123')
    await sso(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'authToken123',
      },
      notice: ['Successfully signed in.'],
    })
    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'device-id', operator: '==', value: 'device123' },
      { field: 'status', operator: '==', value: 'active' },
      { field: 'type', operator: '==', value: 'sso:provider' },
      { field: 'email', operator: '==', value: 'test@example.com' },
    ])
    expect(utils.generateJWTToken).toHaveBeenCalledWith({ uid: 'userId123', type: 'auth' })
    expect(services.addAuthHistory).toHaveBeenCalledWith('userId123', 'device123', 'login')
  })

  test('should validate request and create the user if it not exists', async () => {
    const user = []
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('authToken123')
    ;(services.createUser as jest.Mock).mockResolvedValue({ id: 'userId123' })
    ;(services.addAuthHistory as jest.Mock).mockResolvedValue('userId123')
    await sso(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'authToken123',
      },
      notice: ['Successfully created a new user account.'],
    })
    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'device-id', operator: '==', value: 'device123' },
      { field: 'status', operator: '==', value: 'active' },
      { field: 'type', operator: '==', value: 'sso:provider' },
      { field: 'email', operator: '==', value: 'test@example.com' },
    ])
    expect(utils.generateJWTToken).toHaveBeenCalledWith({ uid: 'userId123', type: 'auth' })
    expect(services.createUser).toBeCalled()
    expect(services.addAuthHistory).toHaveBeenCalledWith('userId123', 'device123', 'register')
  })

  test('Catch internal server error', async () => {
    const user = []
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(services.createUser as jest.Mock).mockResolvedValue(undefined)
    ;(services.addAuthHistory as jest.Mock).mockResolvedValue('userId123')
    await sso(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 500,
      success: false,
      errors: expect.objectContaining({ error: expect.any(String) }),
      notice: ['Error occurred while executing the SSO function.'],
    })
  })
})

describe('otp', () => {
  let req
  let res

  beforeEach(() => {
    req = {
      body: {
        'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
      },
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should validate request and proceed with step 1 of login with otp', async () => {
    const user = [
      {
        'id': 'userId123',
        '2fa': 'phone:+919687206884',
        'created-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
        'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
        'email': 'jainatrivedi9@gmail.com',
        'status': '2fa-setup',
        'type': 'email',
        'updated-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
      },
    ]
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.generateOTP as jest.Mock).mockReturnValue(1234)
    ;(utils.sendOTPViaEmail as jest.Mock).mockResolvedValue(true)
    ;(utils.createPasswordHash as jest.Mock).mockResolvedValue('hasedOTP')
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('step1-jwt-token')

    req.body = {
      ...req.body,
      email: 'jainatrivedi9@gmail.com',
    }

    await otp(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'step1-jwt-token',
      },
      notice: ['please provide otp to login'],
    })
    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'device-id', operator: '==', value: 'FEFB96C8-D858-4652-AC2D-65DD02F388F9' },
      { field: 'email', operator: '==', value: 'jainatrivedi9@gmail.com' },
    ])
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      type: 'verify-otp',
      user: {
        'id': 'userId123',
        '2fa': 'phone:+919687206884',
        'created-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
        'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
        'email': 'jainatrivedi9@gmail.com',
        'status': '2fa-setup',
        'type': 'email',
        'updated-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
      },
      flow: 'login',
      otp: await utils.createPasswordHash(otp.toString()),
    })
  })

  test('should validate request and proceed with step 2 of login with otp ie. verify otp', async () => {
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({
      type: 'verify-otp',
      user: {
        'id': 'userId123',
        '2fa': 'phone:+919687206884',
        'created-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
        'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
        'email': 'jainatrivedi9@gmail.com',
        'status': '2fa-setup',
        'type': 'email',
        'updated-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
      },
      flow: 'login',
      otp: 'hasedOTP',
    })
    ;(utils.generateOTP as jest.Mock).mockReturnValue(1234)
    ;(utils.sendOTPViaSMS as jest.Mock).mockResolvedValue(true)
    ;(utils.createPasswordHash as jest.Mock).mockResolvedValue('hasedOTP')
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('step2-jwt-token')
    ;(utils.comparePassword as jest.Mock).mockReturnValue(true)

    req.body = {
      ...req.body,
      token: 'step-1-token',
      otp: '1234',
    }

    await otp(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'step2-jwt-token',
      },
      notice: ['please verify 2fa for login'],
    })
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      type: 'verify-2fa',
      user: {
        'id': 'userId123',
        '2fa': 'phone:+919687206884',
        'created-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
        'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
        'email': 'jainatrivedi9@gmail.com',
        'status': '2fa-setup',
        'type': 'email',
        'updated-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
      },
      flow: 'login',
      otp: await utils.createPasswordHash(otp.toString()),
    })
  })

  test('should validate request and proceed with step 1 of register with otp', async () => {
    const user = []
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.generateOTP as jest.Mock).mockReturnValue(1234)
    ;(utils.sendOTPViaEmail as jest.Mock).mockResolvedValue(true)
    ;(utils.createPasswordHash as jest.Mock).mockResolvedValue('hasedOTP')
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('step1-jwt-token')

    req.body = {
      ...req.body,
      email: 'jainatrivedi9@gmail.com',
    }

    await otp(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'step1-jwt-token',
      },
      notice: ['please provide otp to register'],
    })
    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'device-id', operator: '==', value: 'FEFB96C8-D858-4652-AC2D-65DD02F388F9' },
      { field: 'email', operator: '==', value: 'jainatrivedi9@gmail.com' },
    ])
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      type: 'verify-otp',
      user: {
        'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
        'email': 'jainatrivedi9@gmail.com',
        'phone': undefined,
        'status': 'unverified',
        'type': 'email',
      },
      flow: 'register',
      otp: await utils.createPasswordHash(otp.toString()),
    })
  })

  test('should validate request and proceed with step 2 of register with otp ie. verify otp', async () => {
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({
      type: 'verify-otp',
      user: {
        email: 'jainatrivedi9@gmail.com',
        status: 'unverified',
        type: 'email',
      },
      flow: 'register',
      otp: 'hasedOTP',
    })
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('step2-jwt-token')
    ;(utils.comparePassword as jest.Mock).mockReturnValue(true)

    req.body = {
      ...req.body,
      token: 'step-1-token',
      otp: 1234,
    }

    await otp(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'step2-jwt-token',
      },
      notice: ['please setup 2fa for register'],
    })
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      type: 'setup-2fa',
      user: {
        email: 'jainatrivedi9@gmail.com',
        status: '2fa-setup',
        type: 'email',
      },
      flow: 'register',
    })
  })
})

describe('auth2FA', () => {
  let req
  let res

  beforeEach(() => {
    req = {
      body: {
        'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
      },
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should validate request and proceed with step 2 of login with otp ie. verify otp', async () => {
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({
      type: 'verify-otp',
      user: {
        'id': 'userId123',
        '2fa': 'phone:+919687206884',
        'created-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
        'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
        'email': 'jainatrivedi9@gmail.com',
        'status': '2fa-setup',
        'type': 'email',
        'updated-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
      },
      flow: 'login',
      otp: 'hasedOTP',
    })
    ;(utils.generateOTP as jest.Mock).mockReturnValue(1234)
    ;(utils.sendOTPViaSMS as jest.Mock).mockResolvedValue(true)
    ;(utils.createPasswordHash as jest.Mock).mockResolvedValue('hasedOTP')
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('step2-jwt-token')
    ;(utils.comparePassword as jest.Mock).mockReturnValue(true)

    req.body = {
      ...req.body,
      token: 'step-1-token',
      otp: '1234',
    }

    await auth2FA(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'step2-jwt-token',
      },
      notice: ['please verify 2fa for login'],
    })
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      type: 'verify-2fa',
      user: {
        'id': 'userId123',
        '2fa': 'phone:+919687206884',
        'created-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
        'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
        'email': 'jainatrivedi9@gmail.com',
        'status': '2fa-setup',
        'type': 'email',
        'updated-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
      },
      flow: 'login',
      otp: await utils.createPasswordHash(otp.toString()),
    })
  })

  test('should validate request and proceed with step 3 of login with otp ie. verify 2fa', async () => {
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({
      type: 'verify-2fa',
      user: {
        'id': 'userId123',
        '2fa': 'phone:+919687206884',
        'created-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
        'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
        'email': 'jainatrivedi9@gmail.com',
        'status': '2fa-setup',
        'type': 'email',
        'updated-at': 'July 20, 2023 at 3:02:34 PM UTC+5:30',
      },
      flow: 'login',
      otp: 'hasedOTP',
    })
    ;(utils.generateOTP as jest.Mock).mockReturnValue(1234)
    ;(utils.sendOTPViaSMS as jest.Mock).mockResolvedValue(true)
    ;(utils.createPasswordHash as jest.Mock).mockResolvedValue('hasedOTP')
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('auth-token')
    ;(utils.comparePassword as jest.Mock).mockReturnValue(true)

    req.body = {
      ...req.body,
      token: 'step-2-token',
      otp: 1234,
    }

    await auth2FA(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'auth-token',
      },
      notice: ['Verification successful'],
    })
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      uid: 'userId123',
      type: 'auth',
    })
  })

  test('should validate request and proceed with step 2 of register with otp ie. verify otp', async () => {
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({
      type: 'verify-otp',
      user: {
        email: 'jainatrivedi9@gmail.com',
        status: 'unverified',
        type: 'email',
      },
      flow: 'register',
      otp: 'hasedOTP',
    })
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('step2-jwt-token')
    ;(utils.comparePassword as jest.Mock).mockReturnValue(true)

    req.body = {
      ...req.body,
      token: 'step-1-token',
      otp: 1234,
    }

    await auth2FA(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'step2-jwt-token',
      },
      notice: ['please setup 2fa for register'],
    })
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      type: 'setup-2fa',
      user: {
        email: 'jainatrivedi9@gmail.com',
        status: '2fa-setup',
        type: 'email',
      },
      flow: 'register',
    })
  })

  test('should validate request and proceed with step 3 of register with otp ie. setup 2fa', async () => {
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({
      type: 'setup-2fa',
      user: {
        email: 'jainatrivedi9@gmail.com',
        status: '2fa-setup',
        type: 'email',
      },
      flow: 'register',
    })
    ;(utils.generateOTP as jest.Mock).mockReturnValue(1234)
    ;(utils.sendOTPViaSMS as jest.Mock).mockResolvedValue(true)
    ;(utils.createPasswordHash as jest.Mock).mockResolvedValue('hasedOTP')
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('step-3-token')
    ;(utils.comparePassword as jest.Mock).mockReturnValue(true)

    req.body = {
      ...req.body,
      token: 'step-2-token',
      phone: '+919876543213',
    }

    await auth2FA(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'step-3-token',
      },
      notice: ['please verify 2fa for register'],
    })
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      type: 'verify-2fa',
      user: {
        'email': 'jainatrivedi9@gmail.com',
        'status': '2fa-setup',
        '2fa': 'phone:+919876543213',
        'type': 'email',
      },
      flow: 'register',
      otp: await utils.createPasswordHash(otp.toString()),
    })
  })

  test('should validate request and proceed with step 4 of register with otp ie. verify 2fa', async () => {
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({
      type: 'verify-2fa',
      user: {
        'email': 'jainatrivedi9@gmail.com',
        'status': '2fa-setup',
        '2fa': 'phone:+919876543213',
        'type': 'email',
      },
      flow: 'register',
      otp: 'hasedOTP',
    })
    ;(utils.generateOTP as jest.Mock).mockReturnValue(1234)
    ;(utils.sendOTPViaSMS as jest.Mock).mockResolvedValue(true)
    ;(utils.createPasswordHash as jest.Mock).mockResolvedValue('hasedOTP')
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('auth-token')
    ;(utils.comparePassword as jest.Mock).mockReturnValue(true)
    ;(services.createUser as jest.Mock).mockResolvedValue({ id: 'userId123' })

    req.body = {
      ...req.body,
      'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
      'token': 'step-3-token',
      'otp': 1234,
    }

    await auth2FA(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'auth-token',
      },
      notice: ['Regiseration successful'],
    })
    expect(services.createUser).toHaveBeenCalledWith({
      '2fa': 'phone:+919876543213',
      'device-id': 'FEFB96C8-D858-4652-AC2D-65DD02F388F9',
      'status': 'active',
      'email': 'jainatrivedi9@gmail.com',
      'type': 'email',
    })
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      uid: 'userId123',
      type: 'auth',
    })
  })
})

describe('register', () => {
  const req = { body: {} }
  const res = {}

  beforeEach(() => {
    // Reset the mock function's state before each test
    jest.clearAllMocks()
  })

  it('should handle missing username and password', async () => {
    req.body = { 'username': 'testuser', 'device-id': 'mock-device-id' }
    await register(req, res)

    jest.spyOn(utils, 'restFormResponseHandler').mockImplementationOnce(() => ({ message: 'response' }))

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      success: false,
      errors: { error: ['username and password are required'] },
      notice: ['Validation error'],
      statusCode: 400,
    })
  })

  it('should handle missing token and totp', async () => {
    req.body = { 'token': 'mock-token', 'device-id': 'mock-device-id' }
    await register(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      success: false,
      errors: { error: ['token and totp are required'] },
      notice: ['Validation error'],
      statusCode: 400,
    })
  })

  it('should handle existing username', async () => {
    req.body = { 'username': 'existing-user', 'password': 'mock-password', 'device-id': 'mock-device-id' }
    jest.spyOn(services, 'findUsers').mockResolvedValueOnce([{ username: 'existing-user' }])
    await register(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      success: false,
      notice: ['Username already exists'],
      statusCode: 400,
    })
  })

  it('should handle invalid token type', async () => {
    req.body = { 'token': 'mock-invalid-token', 'totp': '123456', 'device-id': 'mock-device-id' }
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('auth-token')
    jest.spyOn(utils, 'verifyJWTToken').mockImplementationOnce(() => ({
      username: 'mock-username',
      password: 'mock-password',
      secretKey: 'mock-secret-key',
      type: 'invalid-type',
    }))
    await register(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      success: false,
      notice: ['Invalid token'],
      statusCode: 403,
    })
  })

  it('should handle successful registration', async () => {
    req.body = {
      'username': 'new-user',
      'password': 'mock-password',
      'device-id': 'mock-device-id',
    }
    await register(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        'google-auth-setup': {
          'secret-key': undefined,
        },
        'token': 'auth-token',
      },
      notice: ['Google Authenticator setup required.'],
    })
  })
})

describe('login', () => {
  let req
  let res

  beforeEach(() => {
    req = {
      body: {
        'username': 'testuser',
        'password': 'password123',
        'totp': '123456',
        'token': 'jwtToken123',
        'device-id': 'device123',
      },
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should validate request and authenticate user with username and password', async () => {
    const user = [{ id: 'userId123', password: 'hashedPassword123' }]
    req.body = {
      'password': 'password123',
      'username': 'testuser',
      'device-id': 'device123',
    }
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.comparePassword as jest.Mock).mockReturnValue(true)
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('authToken123')

    await login(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword123')
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      username: 'testuser',
      type: 'login',
    })
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: {
        token: 'authToken123',
      },
      notice: ['Authentication required'],
    })
  })

  test('should return an error response if username or password is wrong', async () => {
    const user = [{ id: 'userId123', password: 'hashedPassword222' }]
    req.body = {
      'password': 'password123',
      'username': 'testuser',
      'device-id': 'device123',
    }
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.comparePassword as jest.Mock).mockReturnValue(false)

    await login(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword222')
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 400,
      success: false,
      notice: ['Invalid credentials'],
    })
  })

  test('should return an error response if username or password is missing', async () => {
    req.body = {
      'username': 'testuser',
      'device-id': 'device123',
    }

    await login(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 400,
      success: false,
      errors: { error: ['username and password are required'] },
      notice: ['Validation error'],
    })
  })

  test('should validate request and authenticate user with token and totp', async () => {
    const user = [{ 'id': 'userId123', 'secret-key': 'secretKey123' }]
    req.body = {
      'totp': '123456',
      'token': 'jwtToken123',
      'device-id': 'device123',
    }
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({ username: 'testuser', type: 'login' })
    ;(utils.verifyTotp as jest.Mock).mockReturnValue(true)
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('authToken123')
    ;(services.addAuthHistory as jest.Mock).mockResolvedValue('userId123')

    await login(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.verifyJWTToken).toHaveBeenCalledWith('jwtToken123')
    expect(utils.verifyTotp).toHaveBeenCalledWith('123456', 'secretKey123')
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      uid: 'userId123',
      type: 'auth',
    })
    expect(services.addAuthHistory).toHaveBeenCalledWith('userId123', 'device123', 'login')
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: { token: 'authToken123' },
      notice: ['Verification successful'],
    })
  })

  test('should return an error response if token or totp is missing', async () => {
    req.body = {
      'totp': '123456',
      'device-id': 'device123',
    }

    await login(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 400,
      success: false,
      errors: { error: ['token and totp are required'] },
      notice: ['Validation error'],
    })
    expect(services.findUsers).not.toHaveBeenCalled()
    expect(utils.verifyJWTToken).not.toHaveBeenCalled()
    expect(utils.verifyTotp).not.toHaveBeenCalled()
    expect(utils.generateJWTToken).not.toHaveBeenCalled()
  })

  test('should return an error response if user does not exist with provided credentials', async () => {
    const user = []

    ;(services.findUsers as jest.Mock).mockResolvedValue(user)

    await login(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 400,
      success: false,
      notice: ['Invalid credentials'],
    })
  })

  test('should return an error response if token type is not "login"', async () => {
    const user = [{ 'id': 'userId123', 'secret-key': 'secretKey123' }]
    req.body = {
      'totp': '123456',
      'token': 'jwtToken123',
      'device-id': 'device123',
    }
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({ username: 'testuser', type: 'register' })

    await login(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.verifyJWTToken).toHaveBeenCalledWith('jwtToken123')
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 403,
      success: false,
      notice: ['Invalid token'],
    })
  })

  test('should return an error response if totp verification fails', async () => {
    const user = [{ 'id': 'userId123', 'secret-key': 'secretKey123' }]
    req.body = {
      'totp': '123456',
      'token': 'jwtToken123',
      'device-id': 'device123',
    }
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({ username: 'testuser', type: 'login' })
    ;(utils.verifyTotp as jest.Mock).mockReturnValue(false)

    await login(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.verifyJWTToken).toHaveBeenCalledWith('jwtToken123')
    expect(utils.verifyTotp).toHaveBeenCalledWith('123456', 'secretKey123')
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 400,
      success: false,
      notice: ['Invalid totp'],
    })
  })

  test('should return an error response for an invalid request', async () => {
    req.body = {}

    await login(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 400,
      success: false,
      notice: ['Invalid request'],
    })
    expect(services.findUsers).not.toHaveBeenCalled()
    expect(utils.verifyJWTToken).not.toHaveBeenCalled()
    expect(utils.verifyTotp).not.toHaveBeenCalled()
    expect(utils.generateJWTToken).not.toHaveBeenCalled()
  })
  test('Catch internal server error', async () => {
    ;(services.findUsers as jest.Mock).mockResolvedValue(undefined)

    await login(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 500,
      success: false,
      errors: expect.objectContaining({ error: expect.any(String) }),
      notice: ['Error occurred while executing the Login function.'],
    })
  })
})

describe('reset', () => {
  let req
  let res

  beforeEach(() => {
    req = {
      body: {
        'username': 'testuser',
        'totp': '123456',
        'device-id': 'device123',
        'password': 'newPassword123',
        'token': 'jwtToken123',
      },
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should validate request and generate reset token for valid username and totp', async () => {
    const user = [{ 'id': 'userId123', 'secret-key': 'secretKey123' }]
    req.body = {
      'username': 'testuser',
      'totp': '123456',
      'device-id': 'device123',
    }
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.verifyTotp as jest.Mock).mockReturnValue(true)
    ;(utils.generateJWTToken as jest.Mock).mockReturnValue('resetToken123')

    await reset(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.verifyTotp).toHaveBeenCalledWith('123456', 'secretKey123')
    expect(utils.generateJWTToken).toHaveBeenCalledWith({
      uid: 'userId123',
      type: 'reset-token',
    })
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      values: { token: 'resetToken123' },
      notice: ['Verified'],
    })
  })
  test('should return an error response if totp is invalid', async () => {
    const user = [{ 'id': 'userId123', 'secret-key': 'secretKey123' }]
    req.body = {
      'username': 'testuser',
      'totp': '000000',
      'device-id': 'device123',
    }
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.verifyTotp as jest.Mock).mockReturnValue(false)

    await reset(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.verifyTotp).toHaveBeenCalledWith('000000', 'secretKey123')

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 401,
      success: false,
      notice: ['Invalid OTP'],
    })
  })

  test('should validate request and update user password for valid token, username, and password', async () => {
    const user = [{ id: 'userId123' }]
    req.body = {
      'username': 'testuser',
      'device-id': 'device123',
      'password': 'newPassword123',
      'token': 'jwtToken123',
    }
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({ uid: 'userId123', type: 'reset-token' })
    ;(utils.createPasswordHash as jest.Mock).mockResolvedValue('hashedPassword123')
    ;(services.updateUserData as jest.Mock).mockResolvedValue({ password: 'hashedPassword123' })
    ;(services.addAuthHistory as jest.Mock).mockResolvedValue('userId123')

    await reset(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.verifyJWTToken).toHaveBeenCalledWith('jwtToken123')
    expect(utils.createPasswordHash).toHaveBeenCalledWith('newPassword123')
    expect(services.updateUserData).toHaveBeenCalledWith('userId123', {
      password: 'hashedPassword123',
    })
    expect(services.addAuthHistory).toHaveBeenCalledWith('userId123', 'device123', 'changepassword')
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 200,
      success: true,
      notice: ['New password created successfully. Please continue to login'],
    })
  })

  test('should return an error response if user not exists', async () => {
    const user = []
    req.body = {
      'username': 'testuser',
      'device-id': 'device123',
      'password': 'newPassword123',
      'token': 'jwtToken123',
    }
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    await reset(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 401,
      success: false,
      notice: ['User does not exist'],
    })
  })

  test('should return an error response if user does not exist with provided username', async () => {
    const user = []

    ;(services.findUsers as jest.Mock).mockResolvedValue(user)

    await reset(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 401,
      success: false,
      notice: ['Username does not exist'],
    })
  })

  test('should return an error response if token type is not "reset-token"', async () => {
    const user = [{ id: 'userId123' }]
    req.body = {
      'username': 'testuser',
      'device-id': 'device123',
      'password': 'newPassword123',
      'token': 'jwtToken123',
    }
    ;(services.findUsers as jest.Mock).mockResolvedValue(user)
    ;(utils.verifyJWTToken as jest.Mock).mockReturnValue({ uid: 'userId123', type: 'auth' })

    await reset(req, res)

    expect(services.findUsers).toHaveBeenCalledWith([
      { field: 'username', operator: '==', value: 'testuser' },
      { field: 'device-id', operator: '==', value: 'device123' },
    ])
    expect(utils.verifyJWTToken).toHaveBeenCalledWith('jwtToken123')
    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 403,
      success: false,
      notice: ['Invalid token'],
    })
  })
  test('Catch internal server error', async () => {
    ;(services.findUsers as jest.Mock).mockResolvedValue(undefined)
    ;(utils.verifyTotp as jest.Mock).mockResolvedValue(true)

    await reset(req, res)

    expect(utils.restFormResponseHandler).toHaveBeenCalledWith({
      res,
      statusCode: 500,
      success: false,
      errors: expect.objectContaining({ error: expect.any(String) }),
      notice: ['Error occurred while executing the Reset function.'],
    })
  })
})
