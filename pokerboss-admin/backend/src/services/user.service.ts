import admin from 'firebase-admin'
import { WhereFilterOp, FieldValue } from 'firebase-admin/firestore'
const db = admin.firestore()

const usersCollection = db.collection('auth-users')

export type UserType = {
  'id'?: string
  'status'?: 'active' | 'inactive' | 'unverified' | '2fa-setup'
  'secret-key'?: string
  'email'?: string
  'password'?: string
  'created-at'?: FieldValue
  'updated-at'?: FieldValue
}
export const addAuthHistory = async (
  userId: string,
  event: 'register' | 'login' | 'logout' | 'changepassword',
): Promise<any> => {
  return await db.collection('auth-history').add({
    'user-id': userId,
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

export const createUser = async (payload: UserType, uid: string) => {
  payload['created-at'] = FieldValue.serverTimestamp()
  payload['updated-at'] = FieldValue.serverTimestamp()
  await usersCollection.doc(uid).set(payload)
  return (await usersCollection.doc(uid).get()).data()
}

export const updateUserData = async (uid: string, data: UserType) => {
  data['updated-at'] = FieldValue.serverTimestamp()
  return await usersCollection.doc(uid).update({ ...data })
}
