// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWib-3CmhFRkP5nVusU-UVHvP2__MlI6I",
  authDomain: "karyakart-94d18.firebaseapp.com",
  projectId: "karyakart-94d18",
  storageBucket: "karyakart-94d18.firebasestorage.app",
  messagingSenderId: "478847206649",
  appId: "1:478847206649:web:92523f61e578364157ce28",
  measurementId: "G-30LC20DZ75"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };
