import admin from 'firebase-admin'

// admin.initializeApp({
//   serviceAccountId:
//       "testing-account@rare-nectar-391918.iam.gserviceaccount.com"
// })

!admin.apps.length ? admin.initializeApp() : admin.app()

export * as auth from './auth'
