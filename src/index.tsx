import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
// import * as serviceWorker from './serviceWorker';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA4VHaCY0M5OrRd94T6UsuFQdtuWKyciGI',
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

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
