// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDv8ftaFjiYBUVCZ6n29gP-DMelTSYik8s",
  authDomain: "mocki-fi.firebaseapp.com",
  projectId: "mocki-fi",
  storageBucket: "mocki-fi.firebasestorage.app",
  messagingSenderId: "953933070510",
  appId: "1:953933070510:web:1427f56d3dbce7ea576d3f",
  measurementId: "G-SVZVZ7JW26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };