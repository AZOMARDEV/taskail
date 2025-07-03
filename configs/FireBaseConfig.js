// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';      
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2qkTJNbO11K3SWi2GlRJkwiyLvJwYYI4",
  authDomain: "internship-project-515d0.firebaseapp.com",
  projectId: "internship-project-515d0",
  storageBucket: "internship-project-515d0.firebasestorage.app",
  messagingSenderId: "951791133609",
  appId: "1:951791133609:web:8740d700fe689b034a5ab8",
  measurementId: "G-VMLFKB3VGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});