import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const config = {
  apiKey: 'AIzaSyA3n0dnLxT93WqewMGK8aEufl6QYnpKQCk',
  authDomain: 'retrospective-7fdad.firebaseapp.com',
  databaseURL: 'https://retrospective-7fdad.firebaseio.com',
  projectId: 'retrospective-7fdad',
  storageBucket: 'retrospective-7fdad.appspot.com',
  messagingSenderId: '444001336318',
};

firebase.initializeApp(config);

export const auth = firebase.auth();
// auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export const firestore = firebase.firestore();
// firestore.enablePersistence();
