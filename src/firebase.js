// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, getDocs, doc} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCW0ZNS0e5GRBm_-npoGZyLbPKrZ7wReP8",
  authDomain: "registration-database-1cd04.firebaseapp.com",
  projectId: "registration-database-1cd04",
  storageBucket: "registration-database-1cd04.firebasestorage.app",
  messagingSenderId: "712667053246",
  appId: "1:712667053246:web:9da525839740844ebdb2ef",
  measurementId: "G-GPPSEYG2PZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


export const auth = getAuth(app);
export {db};
export default app;