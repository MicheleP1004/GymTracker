// //importa le funzioni necessarie da Firebase SDK
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

// import * as env from '$env/static/public';

// //oggetto di configurazione
// const firebaseConfig = {
//     apiKey: env.PUBLIC_API_KEY,
//     authDomain: env.PUBLIC_AUTH_DOMAIN,
//     projectId: env.PUBLIC_PROJECT_ID,
//     storageBucket: env.PUBLIC_STORAGE_BUCKET,
//     messagingSenderId: env.PUBLIC_MESSAGE_SENDER,
//     appId: env.PUBLIC_APP_ID,
//     measurementId: env.PUBLIC_MEASUREMENT_ID
//   };

// //inizializza Firebase
// const app = initializeApp(firebaseConfig);

// //inizializza i servizi di Firebase e li esporta
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging'; // Aggiunto per FCM

import * as env from '$env/static/public';
import { storeFCMToken } from './firestore';

export const vapidKey = 'BPJf7cDaNmhsTbY6AqFWHKDnQSR1x5pkz2SJeS4RewWA2nGBHSG4SEEgpL-vXAS4Sh3-71nmYxA7_mZ6HJJUHRI';

// Configurazione Firebase
const firebaseConfig = {
    apiKey: env.PUBLIC_API_KEY,
    authDomain: env.PUBLIC_AUTH_DOMAIN,
    projectId: env.PUBLIC_PROJECT_ID,
    storageBucket: env.PUBLIC_STORAGE_BUCKET,
    messagingSenderId: env.PUBLIC_MESSAGE_SENDER,
    appId: env.PUBLIC_APP_ID,
    measurementId: env.PUBLIC_MEASUREMENT_ID
};

// Inizializzazione Firebase
const app = initializeApp(firebaseConfig);

// Servizi di Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const messaging = getMessaging(app); // Aggiunto per FCM

