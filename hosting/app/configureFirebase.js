import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const config = {
  apiKey: 'AIzaSyBY75W4d-x8pggftuaVdR6YLc2ZCv4BQWY',
  authDomain: 'davyvong-retro.firebaseapp.com',
  databaseURL: 'https://davyvong-retro.firebaseio.com',
  projectId: 'davyvong-retro',
  storageBucket: 'davyvong-retro.appspot.com',
  messagingSenderId: '577808608561',
  appId: '1:577808608561:web:036cd4ef892f17624d9410',
  measurementId: 'G-BR5ZCDQJJJ',
};

firebase.initializeApp(config);

export const auth = firebase.auth();
// auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export const firestore = firebase.firestore();
// firestore.enablePersistence();
