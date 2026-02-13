import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB0Upq772X38FoZG9iqZPHWHdifhWKmyJ4",
  authDomain: "vibe-38adc.firebaseapp.com",
  projectId: "vibe-38adc",
  storageBucket: "vibe-38adc.firebasestorage.app",
  messagingSenderId: "401423344100",
  appId: "1:401423344100:web:97b10ecf2c9290bdf8a7f1",
  measurementId: "G-2DZQB0NDK8"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços para usar no resto do app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);