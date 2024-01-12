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
      set: jest.fn().mockReturnThis(),
      data: jest.fn().mockReturnThis(),
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
    const event = 'login'

    // Invoke the function
    await addAuthHistory(userId, event)

    // Assertion
    expect(admin.firestore().collection).toHaveBeenCalledWith('auth-history')
    expect(admin.firestore().collection('auth-history').add).toHaveBeenCalledWith({
      'user-id': userId,
      event,
      'created-at': expect.anything(),
    })
  })

  it('should return an array of users if querySnapshot is not empty', async () => {
    // Mock data
    const params: FindUserByKeyArgs[] = [{ field: 'status', operator: '==', value: 'active' }]
    const mockDocData: UserType = { id: 'user1', email: 'user1@pokerboss.dev' }

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

  it('should update user data with provided UID and data', async () => {
    // Mock data
    const uid = 'user123'
    const data: UserType = {
      status: 'active',
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
