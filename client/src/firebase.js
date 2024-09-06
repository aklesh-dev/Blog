// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-320ed.firebaseapp.com",
  projectId: "blog-320ed",
  storageBucket: "blog-320ed.appspot.com",
  messagingSenderId: "458348237562",
  appId: "1:458348237562:web:9aace6401a603e21d36f43",
  measurementId: "G-3G57H8LHC3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);