import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider  } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth'; //importazione di tipo

import * as store from './firestore';

//funzione per registrare un nuovo utente
export async function registerUser(email: string, password: string, name:string, bio:string): Promise<UserCredential> {
  const cred = createUserWithEmailAndPassword(auth, email, password);
  store.addUser(name, bio, (await cred).user.uid, email);
  return cred;
}

//funzione per fare login
export async function loginUser(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

//funzione per fare logout
export async function logoutUser(): Promise<void> {
  return signOut(auth);
}

//funzione per il login con Google
export async function loginWithGoogle(): Promise<UserCredential | null> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    let data = await store.getUserData(result.user.uid);
    if(data == null && result.user.email != null){
      store.addUser(result.user.email.slice(0,result.user.email.search("@")),"",result.user.uid,result.user.email);
    }else{
      throw new Error("Errore durante login con Google");
    }
    return result;
  } catch (error) {
    console.error('Errore durante il login con Google:', error);
    throw error;
  }
}
