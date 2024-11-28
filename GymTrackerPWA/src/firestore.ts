import { collection, query, where, addDoc, getDocs, setDoc, doc, getDoc, updateDoc, arrayUnion, deleteDoc,arrayRemove } from 'firebase/firestore';
import type { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db,storage} from './firebase';
import type { Utente,Friend} from './globalState.svelte';
import type { Esercizio,Scheda,Workout } from './data.svelte';

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
        propic: data.propic,
        requests: data.requests,
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

export async function getExercises(id:string): Promise<Esercizio[] | null> {
  try {
    const q = query(collection(db,'exercises'),where("owner","==",id));
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

export async function getWorkouts(id:string): Promise<Workout[] | null> {
  try {
    const q = query(collection(db,'allenamenti'),where("owner","==",id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size != 0) {
      let es:Workout[]=[];
      querySnapshot.forEach((doc)=>{
        es.push(doc.data() as Workout);
      });
      return es;
    }
    return null;
  } catch (e) {
    console.error('Errore recuperando i dati dell\'utente: ', e);
    return null;
  }
}

export async function saveAllenamento(workout: Workout): Promise<void> {
  try {
    const { owner, date, plan, sets } = workout;
    await addDoc(collection(db, "allenamenti"), { owner, date, plan, sets });

    const userDocRef = doc(db, "users", workout.owner);
    await updateDoc(userDocRef, {
      workouts: arrayUnion({
        date: workout.date,
        plan: workout.plan,
      })
    });

    console.log('Allenamento aggiunto con successo!');
  } catch (e) {
    console.error('Errore aggiungendo l\'allenamento: ', e);
  }
}

export async function savePlan(scheda: Scheda): Promise<void> {
  try {
    const {owner,name,descrizione,esercizi} = scheda;
    await addDoc(collection(db, "schede"), {owner,name,descrizione,esercizi});

    const userDocRef = doc(db, "users", scheda.owner);
    await updateDoc(userDocRef, {
      plans: arrayUnion({
        name: scheda.name
      })
    });

    console.log('Piano aggiunto con successo!');
  } catch (e) {
    console.error('Errore aggiungendo il piano: ', e);
  }
}

export async function saveEsercizio(esercizio: Esercizio): Promise<void> {
  try {
    const { owner, name, descrizione, tipo } = esercizio;
    await addDoc(collection(db, "exercises"), { owner, name, descrizione, tipo });

    console.log('Esercizio aggiunto con successo!');
  } catch (e) {
    console.error('Errore aggiungendo l\'esercizio: ', e);
  }
}

export async function deleteAllenamento(owner: string, plan: string, date: string): Promise<void> {
  try {
    const q = query(
      collection(db, 'allenamenti'),
      where('owner', '==', owner),
      where('plan', '==', plan),
      where('date', '==', date)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((docSnapshot) => {
        console.log('Found Allenamento:', docSnapshot.data());
      });

      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, 'allenamenti', docSnapshot.id));
      });

      const workoutToRemove = { date,plan };

      console.log('Removing from workouts array:', workoutToRemove);

      const userDocRef = doc(db, 'users', owner);
      await updateDoc(userDocRef, {
        workouts: arrayRemove(workoutToRemove)
      });

      console.log('Allenamento rimosso con successo!');
    } else {
      console.log('Allenamento non trovato.');
    }
  } catch (e) {
    console.error('Errore rimuovendo l\'allenamento: ', e);
  }
}

export async function deletePlan(owner: string, name: string): Promise<void> {
  try {
    const q = query(
      collection(db, 'schede'),
      where('owner', '==', owner),
      where('name', '==', name)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((docSnapshot) => {
        console.log('Found Plan:', docSnapshot.data());
      });

      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, 'schede', docSnapshot.id));
      });

      const planToRemove = { name };

      console.log('Removing from plans array:', planToRemove);

      const userDocRef = doc(db, 'users', owner);
      await updateDoc(userDocRef, {
        plans: arrayRemove(planToRemove)
      });

      console.log('Piano rimosso con successo!');
    } else {
      console.log('Piano non trovato.');
    }
  } catch (e) {
    console.error('Errore rimuovendo il piano: ', e);
  }
}

export async function deleteEsercizio(owner: string, name: string): Promise<void> {
  try {
    const q = query(
      collection(db, 'exercises'),
      where('owner', '==', owner),
      where('name', '==', name)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const exerciseDoc = querySnapshot.docs[0];
      await deleteDoc(exerciseDoc.ref);

      console.log('Esercizio eliminato con successo!');
    } else {
      console.log('Esercizio non trovato.');
    }
  } catch (e) {
    console.error('Errore eliminando l\'esercizio: ', e);
  }
}

export async function addRequest(receiver: string,sender:string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', receiver);

    await updateDoc(userDocRef, {
      requests: arrayUnion(sender)
    });

    console.log(`Richiesta di amicizia inviata a ${receiver}`);
  } catch (e) {
    console.error('Errore inviando la richiesta di amicizia: ', e);
  }
}


export async function deleteRequest(id: string,uid:string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);

    await updateDoc(userDocRef, {
      requests: arrayRemove(id)
    });

    console.log(`Richiesta di amicizia da ${id} rimossa.`);
  } catch (e) {
    console.error('Errore rimuovendo la richiesta di amicizia: ', e);
  }
}


export async function addFriend(id1: string, id2: string): Promise<void> {
  try {
    const user1DocRef = doc(db, 'users', id1);
    const user2DocRef = doc(db, 'users', id2);

    await Promise.all([
      updateDoc(user1DocRef, {
        friends: arrayUnion(id2)
      }),
      updateDoc(user2DocRef, {
        friends: arrayUnion(id1)
      })
    ]);

    console.log(`Amicizia aggiunta tra ${id1} e ${id2}.`);
  } catch (e) {
    console.error('Errore aggiungendo l\'amicizia: ', e);
  }
}

export async function getUserDataAsFriend(id: string): Promise<Friend | null> {
  try {
    // Recupera i dati dell'utente
    const userData = await getUserData(id);

    if (!userData) {
      console.log(`Utente con ID ${id} non trovato.`);
      return null;
    }

    // Crea un oggetto Friend con i dati pertinenti
    const friend: Friend = {
      uid: userData.uid,
      username: userData.username,
      propic: userData.propic || '', // Se l'immagine del profilo è mancante, assegna una stringa vuota
    };

    return friend;
  } catch (error) {
    console.error(`Errore recuperando i dati come Friend per l'utente ${id}: `, error);
    return null;
  }
}

export async function deleteFriendship(id1: string, id2: string): Promise<void> {
  try {
    const user1DocRef = doc(db, 'users', id1);
    const user2DocRef = doc(db, 'users', id2);

    // Rimuove gli utenti dalla lista amici reciproca
    await Promise.all([
      updateDoc(user1DocRef, {
        friends: arrayRemove(id2) // Rimuove direttamente la stringa ID
      }),
      updateDoc(user2DocRef, {
        friends: arrayRemove(id1)
      })
    ]);

    console.log(`Amicizia rimossa tra ${id1} e ${id2}.`);
  } catch (e) {
    console.error('Errore rimuovendo l\'amicizia: ', e);
  }
}

export async function fetchUsersWithTerm(term: string): Promise<Friend[]> {
  try {
      const q = query(
          collection(db, 'users'),
          where('username', '>=', term),
          where('username', '<=', term + '\uf8ff') // Filtro per nomi che iniziano con il termine
      );

      const querySnapshot = await getDocs(q);
      const friends: Friend[] = [];

      querySnapshot.forEach((doc) => {
          const data = doc.data();
          friends.push({
              uid: doc.id,
              username: data.username,
              propic: data.propic || '', // Assicurati che `propic` sia opzionale o gestito in modo adeguato
          });
      });

      return friends;
  } catch (error) {
      console.error('Errore durante la ricerca degli utenti:', error);
      return [];
  }
}

export async function deliverRequest(receiverId: string, senderId: string): Promise<void> {
  try {
    // Riferimento al documento dell'utente ricevente
    const receiverDocRef = doc(db, 'users', receiverId);

    // Aggiunge l'ID del mittente al campo "requests" del ricevente
    await updateDoc(receiverDocRef, {
      requests: arrayUnion(senderId)
    });

    console.log(`Richiesta di amicizia da ${senderId} consegnata a ${receiverId}`);
  } catch (error) {
    console.error(`Errore durante la consegna della richiesta di amicizia: `, error);
  }
}
// // Recupera le richieste di amicizia dal campo "requests" della collezione "users"
// export async function getFriendRequests(userId: string): Promise<string[]> {
//   try {
//     // Recupera il documento dell'utente dalla collezione "users"
//     const userDoc = await getDoc(doc(db, 'users', userId));

//     if (userDoc.exists()) {
//       const data = userDoc.data();

//       // Controlla se il campo "requests" esiste ed è un array
//       if (data.requests && Array.isArray(data.requests)) {
//         console.log('Richieste di amicizia recuperate:', data.requests);
//         return data.requests as string[];
//       } else {
//         console.log('Nessuna richiesta di amicizia trovata.');
//         return [];
//       }
//     } else {
//       console.log('Documento utente non trovato.');
//       return [];
//     }
//   } catch (e) {
//     console.error('Errore recuperando le richieste di amicizia: ', e);
//     return [];
//   }
// }