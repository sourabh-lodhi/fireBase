import * as schema from '../auth.schema'

describe('authSSO', () => {
  test('should validate authSSO schema successfully', () => {
    const data = { 'firebase-token': 'firebaseToken', 'device-id': 'deviceId' }

    const { error } = schema.authSSO.validate(data)
    expect(error).toBeUndefined()
  })

  test('should return validation error for missing required fields in authSSO', () => {
    const data = {
      email: 'test@example.com',
    }

    const { error } = schema.authSSO.validate(data)
    expect(error).toBeDefined()
    expect(error.details.length).toBeGreaterThan(0)
  })
})

describe('authRegister', () => {
  test('should validate authRegister schema successfully', () => {
    const data = {
      'username': 'test.example',
      'password': 'password123',
      'device-id': '123456',
    }

    const { error } = schema.authRegister.validate(data)
    expect(error).toBeUndefined()
  })

  test('should return validation error for invalid username in authRegister', () => {
    const data = {
      'username': 'j',
      'password': 'password123',
      'device-id': '123456',
    }

    const { error } = schema.authRegister.validate(data)
    expect(error).toBeDefined()
    expect(error.details.length).toBeGreaterThan(0)
  })
})

describe('authLogin', () => {
  test('should validate authLogin schema successfully', () => {
    const data = {
      'device-id': '123456',
      'username': 'test.example',
      'password': 'password123',
      'token': 'token123',
      'totp': '123456',
    }

    const { error } = schema.authLogin.validate(data)
    expect(error).toBeUndefined()
  })

  test('should return validation error for missing required fields in authLogin', () => {
    const data = {}

    const { error } = schema.authLogin.validate(data)
    expect(error).toBeDefined()
    expect(error.details.length).toBeGreaterThan(0)
  })
})

describe('authReset', () => {
  test('should validate authReset schema successfully', () => {
    const data = {
      'device-id': '123456',
      'username': 'john.doe',
      'password': 'password123',
      'token': 'token123',
      'totp': '123456',
    }

    const { error } = schema.authReset.validate(data)
    expect(error).toBeUndefined()
  })

  test('should return validation error for invalid password in authReset', () => {
    const data = {
      'device-id': '123456',
      'username': 'john.doe',
      'password': 'pass',
      'token': 'token123',
      'totp': '123456',
    }

    const { error } = schema.authReset.validate(data)
    expect(error).toBeDefined()
    expect(error.details.length).toBeGreaterThan(0)
  })
})

describe('auth2FA', () => {
  test('should validate auth2FA schema successfully', () => {
    const data = {
      'device-id': '123456',
      'email': 'johndoe@gmail.com',
      'phone': '9090909090',
      'token': 'token123',
      'otp': '1234',
    }

    const { error } = schema.auth2FA.validate(data)
    expect(error).toBeUndefined()
  })

  test('should return validation error for invalid password in auth2FA', () => {
    const data = {
      'device-id': '123456',
      'phone': '9090909090',
    }

    const { error } = schema.auth2FA.validate(data)
    expect(error).toBeDefined()
    expect(error.details.length).toBeGreaterThan(0)
  })
})
