import admin from 'firebase-admin';
import serviceAccount from './predictiondbKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
export const jwtSecret = 'Sacra';
