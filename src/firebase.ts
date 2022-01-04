import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { apiKeys } from './config.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKeys.firebase,
  authDomain: 'endurarace-5a58a.firebaseapp.com',
  projectId: 'endurarace-5a58a',
  storageBucket: 'endurarace-5a58a.appspot.com',
  messagingSenderId: '569631507348',
  appId: '1:569631507348:web:29759b88ede9ac901e4581',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Detect auth state
onAuthStateChanged(auth, (user) => {
  if (user !== null) {
    console.log('Logged in!');
  } else {
    console.log('No user');
  }
});

module.exports = { db, auth };
