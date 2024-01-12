import * as admin from 'firebase-admin'
import * as test from 'firebase-functions-test'

// Import the module to be tested
import { addAuthHistory, findUsers, createUser, updateUserData, UserType, FindUserByKeyArgs } from '../user.service'

admin.initializeApp()

// Initialize the firebase-functions-test library
const firebaseTest = test.default()

// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => {
  return {
    initializeApp: jest.fn(),
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnThis(),
      get: jest.fn(() => Promise.resolve([])),
      add: jest.fn(() => Promise.resolve({ get: jest.fn(() => Promise.resolve({})) })),
      update: jest.fn(() => Promise.resolve({})),
      where: jest.fn().mockReturnThis(),
    }),
  }
})

describe('User Service', () => {
  let adminInitStub: any

  beforeAll(() => {
    // Stub Firebase Admin SDK initialization
    adminInitStub = jest.spyOn(admin, 'initializeApp')
    adminInitStub.mockImplementation(() => {})
  })

  afterAll(() => {
    // Clean up
    adminInitStub.mockRestore()
    firebaseTest.cleanup()
  })

  afterEach(() => {
    // Reset the mocks after each test
    jest.clearAllMocks()
  })

  it('should add auth history with provided parameters', async () => {
    // Mock data
    const userId = 'user123'
    const deviceId = 'device123'
    const event = 'login'

    // Invoke the function
    await addAuthHistory(userId, deviceId, event)

    // Assertion
    expect(admin.firestore().collection).toHaveBeenCalledWith('auth-history')
    expect(admin.firestore().collection('auth-history').add).toHaveBeenCalledWith({
      'user-id': userId,
      'device-id': deviceId,
      event,
      'created-at': expect.anything(),
    })
  })

  it('should query users collection with the provided parameters', async () => {
    // Mock data
    const params: FindUserByKeyArgs[] = [
      { field: 'status', operator: '==', value: 'active' },
      { field: 'type', operator: '==', value: 'email' },
    ]

    // Invoke the function
    await findUsers(params)

    // Assertions
    expect(admin.firestore().collection('auth-users').where).toHaveBeenCalledTimes(2)
    expect(admin.firestore().collection('auth-users').where).toHaveBeenNthCalledWith(1, 'status', '==', 'active')
    expect(admin.firestore().collection('auth-users').where).toHaveBeenNthCalledWith(2, 'type', '==', 'email')
    expect(admin.firestore().collection('auth-users').get).toHaveBeenCalled()
  })

  it('should return an array of users if querySnapshot is not empty', async () => {
    // Mock data
    const params: FindUserByKeyArgs[] = [{ field: 'status', operator: '==', value: 'active' }]
    const mockDocData: UserType = { id: 'user1', username: 'user1@example.com' }

    // Mock non-empty querySnapshot
    const mockQuerySnapshot = {
      empty: false,
      forEach: jest.fn((callback) =>
        // eslint-disable-next-line n/no-callback-literal
        callback({
          id: 'doc1',
          data: jest.fn().mockReturnValue(mockDocData),
        }),
      ),
    }
    ;(admin.firestore().collection('auth-users').get as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)

    // Invoke the function
    const result = await findUsers(params)

    // Assertion
    expect(result).toEqual([{ id: 'user1', ...mockDocData }])
  })

  it('should return an empty array if querySnapshot is empty', async () => {
    // Mock data
    const params: FindUserByKeyArgs[] = [{ field: 'status', operator: '==', value: 'active' }]

    // Mock empty querySnapshot
    const mockQuerySnapshot = {
      empty: true,
    }
    ;(admin.firestore().collection('auth-users').get as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)

    // Invoke the function
    const result = await findUsers(params)

    // Assertion
    expect(result).toEqual([])
  })

  it('should create a new user with provided data', async () => {
    // Mock data
    const payload: UserType = {
      username: 'testuser',
      email: 'test@example.com',
    }

    // Invoke the function
    await createUser(payload)

    // Assertion
    expect(admin.firestore().collection('auth-users').add).toHaveBeenCalledWith({
      ...payload,
      'created-at': expect.anything(),
      'updated-at': expect.anything(),
    })
  })

  it('should update user data with provided UID and data', async () => {
    // Mock data
    const uid = 'user123'
    const data: UserType = {
      'status': 'active',
      '2fa': '123456',
    }

    // Invoke the function
    await updateUserData(uid, data)

    // Assertion
    expect(admin.firestore().collection('auth-users').doc).toHaveBeenCalledWith(uid)
    expect(admin.firestore().collection('auth-users').doc().update).toHaveBeenCalledWith({
      ...data,
      'updated-at': expect.anything(),
    })
  })
})

// // Mock dependencies
// const mockAdd = jest.fn(() => Promise.resolve({}))
// const mockCollection = jest.fn(() => ({ add: mockAdd }))
// jest.mock('firebase-admin', () => ({
//   firestore: jest.fn().mockReturnValue({
//     collection: mockCollection,
//   }),
// }))
// import { addAuthHistory } from '../user.service'

// // Import the function

// describe('addAuthHistory', () => {
//   it('should add auth history with provided parameters', async () => {
//     // Mock data
//     const userId = 'user123'
//     const deviceId = 'device123'
//     const event = 'login'

//     // Invoke the function
//     await addAuthHistory(userId, deviceId, event)

//     // Assertion
//     expect(mockCollection).toHaveBeenCalledWith('auth-history')
//     expect(mockAdd).toHaveBeenCalledWith({
//       'user-id': userId,
//       'device-id': deviceId,
//       event,
//       'created-at': expect.anything(),
//     })
//   })
// })
