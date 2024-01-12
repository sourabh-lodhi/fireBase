import admin from 'firebase-admin'
import { WhereFilterOp, FieldValue } from 'firebase-admin/firestore'
const db = admin.firestore()

const usersCollection = db.collection('auth-users')

export type UserType = {
  'id'?: string
  'status'?: 'active' | 'inactive' | 'unverified' | '2fa-setup'
  'notice'?: string
  'device-id'?: string
  'type'?: 'email' | 'phone' | 'sso:google' | 'sso:facebook' | 'sso:apple' | 'username'
  'username'?: string
  'phone'?: string
  'secret-key'?: string
  'email'?: string
  'password'?: string
  '2fa'?: string
  'created-at'?: FieldValue
  'updated-at'?: FieldValue
}
export const addAuthHistory = async (
    userId: string,
    deviceId: string | null,
    event: 'register' | 'login' | 'logout' | 'changepassword',
): Promise<any> => {
  return await db.collection('auth-history').add({
    'user-id': userId,
    'device-id': deviceId,
    event,
    'created-at': FieldValue.serverTimestamp(),
  })
}

export type FindUserByKeyArgs = {
  field: keyof UserType
  operator: WhereFilterOp
  value: any
}

export const findUsers = async (params: FindUserByKeyArgs[]) => {
  let query: admin.firestore.Query<admin.firestore.DocumentData> = usersCollection
  params.forEach(({ field, operator, value }) => {
    query = query.where(field, operator, value)
  })

  const querySnapshot = await query.get()

  const users: UserType[] = []
  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      const user = doc.data()
      users.push({ id: doc.id, ...user })
    })
  }

  return users
}

export const createUser = async (payload: UserType) => {
  payload['created-at'] = FieldValue.serverTimestamp()
  payload['updated-at'] = FieldValue.serverTimestamp()
  return await (await usersCollection.add(payload)).get()
}

export const updateUserData = async (uid: string, data: UserType) => {
  data['updated-at'] = FieldValue.serverTimestamp()
  return await usersCollection.doc(uid).update({ ...data })
}
