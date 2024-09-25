//importa le funzioni necessarie da Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

//oggetto di configurazione
const firebaseConfig = {
    apiKey: "AIzaSyAHu55oxRvlmFuuRkVfcM4JeF8TvIqlhg0",
    authDomain: "gymtrackerpwa.firebaseapp.com",
    projectId: "gymtrackerpwa",
    storageBucket: "gymtrackerpwa.appspot.com",
    messagingSenderId: "1046461599327",
    appId: "1:1046461599327:web:a5e22aa12f42ae252515ea",
    measurementId: "G-K6QV8KPFH2"
  };

//inizializza Firebase
const app = initializeApp(firebaseConfig);

//inizializza i servizi di Firebase e li esporta
export const auth = getAuth(app);
export const db = getFirestore(app);
