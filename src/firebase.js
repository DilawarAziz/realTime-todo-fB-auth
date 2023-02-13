// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyChnvg-z-XtYf-JnptDRhXA25AlDFw6DKc",
    authDomain: "todo-apps-fc62e.firebaseapp.com",
    databaseURL: "https://todo-apps-fc62e-default-rtdb.firebaseio.com",
    projectId: "todo-apps-fc62e",
    storageBucket: "todo-apps-fc62e.appspot.com",
    messagingSenderId: "883429240111",
    appId: "1:883429240111:web:e615327cd2710170e085da",
    measurementId: "G-GK925ZD5EQ"
  };
  

// Initialize Firebase
const App = firebase.initializeApp(firebaseConfig);
export default App;
