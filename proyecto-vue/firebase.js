import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC8aKnfLZZcUv-AfRpMajOwomqlAXCqk6A",
  authDomain: "proyecto-lenguajes-5eec1.firebaseapp.com",
  projectId: "proyecto-lenguajes-5eec1",
  storageBucket: "proyecto-lenguajes-5eec1.firebasestorage.app",
  messagingSenderId: "930810968549",
  appId: "1:930810968549:web:5e48201afd10b026f1d70c",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);