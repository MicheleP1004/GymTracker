import { collection, query, where, addDoc, getDocs, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import type { DocumentData, QuerySnapshot } from 'firebase/firestore'; //importazione di tipo
import { db,storage} from './firebase';

import type { Utente } from './globalState.svelte';
// import type { Esercizio,Scheda } from './globalState.svelte';
import type { Esercizio,Scheda } from './data.svelte';

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


import { ref, uploadBytes, getDownloadURL, type UploadResult } from "firebase/storage";

export async function addUser(
  username: string, 
  bio: string, 
  id: string, 
  email: string, 
  file: File | null | string
): Promise<void> {
  try {
    let propicUrl:string | null = null;

    if (file) {
      if (file instanceof File){
        propicUrl = await uploadImage(file);
      }else{
        propicUrl = file;
      }
    }

    await setDoc(doc(db, "users", id), {
      username,
      bio,
      email,
      propic: propicUrl,
      friends: [],
      workouts: [],
      plans: []
    });

    console.log('Utente creato o aggiornato con successo!');

  } catch (e) {
    console.error('Errore creando utente: ', e);
  }
}

export async function getUserData(id: string): Promise<Utente | null> {
  try {
    // console.log(id);
    const userDoc = await getDoc(doc(db, 'users', id));

    if (userDoc.exists()) {
      const data = userDoc.data();

      //restituisce i dati convertiti nel formato Utente
      return {
        uid: id,
        email: data.email,
        username: data.username,
        bio: data.bio,
        friends: data.friends || [],
        workouts: data.workouts || [],
        plans: data.plans || [],
        propic: data.propic
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

// export async function updateUtente(u:Utente):Promise<void>{
//   const docRef = doc(db,"users",u.uid);
//   await updateDoc(docRef,u);
// }

async function uploadImage(file:File): Promise<string> {
  //crea un riferimento al file su Firebase Storage
  const storageRef = ref(storage, 'images/' + file.name);

  try {
    const snapshot: UploadResult = await uploadBytes(storageRef, file);

    const downloadURL: string = await getDownloadURL(snapshot.ref);

    console.log('Immagine caricata con successo:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('Errore durante il caricamento dell\'immagine:', error);
    return "error";
  }
}

export async function getExcercises(id:string): Promise<Esercizio[] | null> {
  try {
    const q = query(collection(db,'excercises'),where("owner","==",id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size != 0) {
      let es:Esercizio[]=[];
      querySnapshot.forEach((doc)=>{
        es.push(doc.data() as Esercizio);
      });
      return es;
    }
    return null;
  } catch (e) {
    console.error('Errore recuperando i dati dell\'utente: ', e);
    return null;
  }
}

export async function getSchede(id:string): Promise<Scheda[] | null> {
  try {
    const q = query(collection(db,'schede'),where("owner","==",id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size != 0) {
      let es:Scheda[]=[];
      querySnapshot.forEach((doc)=>{
        es.push(doc.data() as Scheda);
      });
      return es;
    }
    return null;
  } catch (e) {
    console.error('Errore recuperando i dati dell\'utente: ', e);
    return null;
  }
}