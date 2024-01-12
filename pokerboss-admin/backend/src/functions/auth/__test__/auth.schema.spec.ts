import * as schema from '../auth.schema'

describe('authRegister', () => {
  test('should validate authRegister schema successfully', () => {
    const data = {
      email: 'test@pokerboss.dev',
      password: 'password123',
    }

    const { error } = schema.authRegister.validate(data)
    expect(error).toBeUndefined()
  })

  test('should return validation error for invalid email in authRegister', () => {
    const data = {
      username: 'j',
      password: 'password123',
    }

    const { error } = schema.authRegister.validate(data)
    expect(error).toBeDefined()
    expect(error.details.length).toBeGreaterThan(0)
  })
})

describe('authLogin', () => {
  test('should validate authLogin schema successfully', () => {
    const data = {
      email: 'test@pokerboss.dev',
      password: 'password123',
      token: 'token123',
      tOtp: '123456',
    }
    const { error } = schema.authLogin.validate(data)
    expect(error).toBeUndefined()
  })
})

describe('authReset', () => {
  test('should validate authReset schema successfully', () => {
    const data = {
      email: 'john@pokerboss.dev',
      newPassword: 'password123',
      token: 'token123',
      emailOtp: '123456',
    }

    const { error } = schema.authReset.validate(data)
    expect(error).toBeUndefined()
  })

  test('should return validation error for invalid password in authReset', () => {
    const data = {
      email: 'john.doe',
      newPassword: 'pass',
      token: 'token123',
      emailOtp: '123456',
    }

    const { error } = schema.authReset.validate(data)
    expect(error).toBeDefined()
    expect(error.details.length).toBeGreaterThan(0)
  })
})
