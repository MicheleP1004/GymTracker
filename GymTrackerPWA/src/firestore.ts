// import { db } from './firebase';
import {  initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import type { DocumentData, QuerySnapshot } from 'firebase/firestore'; //importazione di tipo

import type { Utente } from './globalState.svelte';

const firebaseConfig = {
  apiKey: "AIzaSyAHu55oxRvlmFuuRkVfcM4JeF8TvIqlhg0",
  authDomain: "gymtrackerpwa.firebaseapp.com",
  projectId: "gymtrackerpwa",
  storageBucket: "gymtrackerpwa.appspot.com",
  messagingSenderId: "1046461599327",
  appId: "1:1046461599327:web:a5e22aa12f42ae252515ea",
  measurementId: "G-K6QV8KPFH2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//aggiunge un nuovo documento
export async function addData(collectionName: string, data: object): Promise<void> {
  try {
    await addDoc(collection(db, collectionName), data);
  } catch (e) {
    console.error('Errore aggiungendo documento: ', e);
  }
}

//ottieni tutti i documenti
export async function getData(collectionName: string): Promise<DocumentData[]> {
  const querySnapshot: QuerySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => doc.data());
}

//inizializza un nuovo utente
export async function addUser(name:string, bio:string, id:string,email:string):Promise<void>{
  try {
    await setDoc(doc(db, "users", id), { name, bio, email,friends: [], workouts: [], plans: []});
    console.log('Utente creato o aggiornato con successo!');
  } catch (e) {
    console.error('Errore creando utente: ', e);
  }
}

export async function getUserData(id: string): Promise<Utente | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', id));

    if (userDoc.exists()) {
      const data = userDoc.data();

      //restituisce i dati convertiti nel formato Utente
      return {
        uid: data.uid,
        email: data.email,
        username: data.username,
        bio: data.bio,
        friends: data.friends || [],
        workouts: data.workouts || [],
        plans: data.plans || []
      } as Utente;
    } else {
      console.log('Documento utente non trovato.');
      return null;
    }
  } catch (e) {
    console.error('Errore recuperando i dati dell\'utente: ', e);
    return null;
  }
}

export async function updateUtente(u:Utente):Promise<void>{
  const docRef = doc(db,"users",u.uid);
  await updateDoc(docRef,u);
}