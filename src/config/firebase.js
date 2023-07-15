
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyCBh_sjNIDP0tIt5Dl4UYzaoXHRc6B-H1U",
  authDomain: "cashwise-195d2.firebaseapp.com",
  databaseURL: "https://cashwise-195d2-default-rtdb.firebaseio.com",
  projectId: "cashwise-195d2",
  storageBucket: "cashwise-195d2.appspot.com",
  messagingSenderId: "280010822637",
  appId: "1:280010822637:web:2ff29d194bea85f3d70de4",
  measurementId: "G-TE0YRH2R24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);