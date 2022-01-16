import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import apiKeys from './config.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKeys.firebaseAPIKey,
  authDomain: 'endurarace-5a58a.firebaseapp.com',
  projectId: 'endurarace-5a58a',
  storageBucket: 'endurarace-5a58a.appspot.com',
  messagingSenderId: '569631507348',
  appId: '1:569631507348:web:29759b88ede9ac901e4581',
};

// Initialize Firebase
console.log(firebaseConfig);
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
