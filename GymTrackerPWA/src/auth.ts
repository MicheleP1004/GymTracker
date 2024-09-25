import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider  } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth'; // Importazione di tipo

//funzione per registrare un nuovo utente
export async function registerUser(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
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
    return result;
  } catch (error) {
    console.error('Errore durante il login con Google:', error);
    throw error;
  }
}
