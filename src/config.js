import dotenv from 'dotenv';

dotenv.config();

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'endurarace-5a58a.firebaseapp.com',
  projectId: 'endurarace-5a58a',
  storageBucket: 'endurarace-5a58a.appspot.com',
  messagingSenderId: '569631507348',
  appId: '1:569631507348:web:29759b88ede9ac901e4581',
};

export const serviceAccount = process.env.FIREBASE_SERVICE_KEY;
