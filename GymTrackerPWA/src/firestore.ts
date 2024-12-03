import { collection, query, where, addDoc, getDocs, setDoc, doc, getDoc, updateDoc, arrayUnion, deleteDoc,arrayRemove, orderBy, limit, startAfter } from 'firebase/firestore';
import type { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { db,storage} from './firebase';
import { type Utente,type Friend, Chat, type Message} from './globalState.svelte';
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
        pushToken: data.pushToken,
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
    // Creiamo un ID documento ordinato
    const docId = [id1, id2].sort().join('_'); // Ordiniamo id1 e id2 per evitare duplicati

    // Aggiungiamo l'amicizia al documento
    await setDoc(doc(db, 'chats', docId), {
      users: [id1, id2],
      messages:[],
    });

    // Aggiorniamo le liste amici dei due utenti
    const user1DocRef = doc(db, 'users', id1);
    const user2DocRef = doc(db, 'users', id2);

    await Promise.all([
      updateDoc(user1DocRef, {
        friends: arrayUnion(id2),
      }),
      updateDoc(user2DocRef, {
        friends: arrayUnion(id1),
      }),
    ]);

    console.log(`Amicizia aggiunta tra ${id1} e ${id2}`);
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
    // Creiamo un ID documento ordinato
    const docId = [id1, id2].sort().join('_'); // Ordiniamo id1 e id2 per evitare duplicati

    // Rimuoviamo il documento dell'amicizia
    const friendshipDocRef = doc(db, 'chats', docId);
    await deleteDoc(friendshipDocRef);

    // Rimuoviamo gli utenti dalla lista amici reciproca
    const user1DocRef = doc(db, 'users', id1);
    const user2DocRef = doc(db, 'users', id2);

    await Promise.all([
      updateDoc(user1DocRef, {
        friends: arrayRemove(id2),
      }),
      updateDoc(user2DocRef, {
        friends: arrayRemove(id1),
      }),
    ]);

    console.log(`Amicizia rimossa tra ${id1} e ${id2}`);
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

export async function storeFCMToken(id: string, token: string) {
  try {
      const userRef = doc(db, 'users', id); // Usa l'id passato per il documento
      await setDoc(userRef, {
          pushToken: token
      }, { merge: true }); // Usa 'merge' per evitare di sovrascrivere altri dati
      console.log("Token salvato per l'utente con ID:", id);
  } catch (error) {
      console.error("Errore durante il salvataggio del token:", error);
  }
}

export async function getPushToken(id: string): Promise<string | null> {
  try {
    // Recupera il documento dell'utente dalla collection 'users'
    const userDocRef = doc(db, 'users', id);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Restituisce il pushToken se presente
      return userData?.pushToken || null;
    } else {
      console.log(`Utente con ID ${id} non trovato.`);
      return null;
    }
  } catch (e) {
    console.error('Errore recuperando il pushToken:', e);
    return null;
  }
}

export async function sendNotification(id: string, title: string, body: string, icon: string) {
  try {
    // Ottieni il pushToken dell'utente
    const token = await getPushToken(id);
    if (!token) {
      console.log('Token non trovato, impossibile inviare la notifica');
      return;
    }

    // Crea un nuovo documento nella collection 'notifications' per inviare la notifica
    await addDoc(collection(db, 'notifications'), {
      title: title,
      body: body,
      icon: icon,
      token: token,  // Usa il token dell'utente per inviare la notifica
    });

    console.log('Notifica aggiunta alla collection notifications');
  } catch (e) {
    console.error('Errore durante l\'invio della notifica:', e);
  }
}

export async function fetchChat(id1: string, id2: string): Promise<Chat | null> {
  const [sortedId1, sortedId2] = [id1, id2].sort();
  const chatDocId = `${sortedId1}_${sortedId2}`;

  const chatsCollection = collection(db, 'chats');

  const chatDocRef = doc(chatsCollection, chatDocId);

  const chatDoc = await getDoc(chatDocRef);

  if (!chatDoc.exists()) {
    console.error('Chat non trovata per gli ID:', id1, id2);
    return null; 
  }

  const chatData = chatDoc.data();

  const messages: Message[] =
    chatData?.messages.map((msg: any) => ({
      sender: msg.sender,
      text: msg.text,
      timestamp: msg.timestamp,
    })) || [];

  return new Chat(id1, id2, messages);
}

// // Primo caricamento: Carica i primi n messaggi
// export async function fetchChat(
//   id1: string,
//   id2: string,
//   maxMsg: number
// ): Promise<Chat | null> {
//   const [sortedId1, sortedId2] = [id1, id2].sort();
//   const chatDocId = `${sortedId1}_${sortedId2}`;

//   const chatsCollection = collection(db, 'chats');
//   const chatDocRef = doc(chatsCollection, chatDocId);

//   // Verifica se la chat esiste
//   const chatDocSnapshot = await getDocs(query(chatsCollection));
//   if (chatDocSnapshot.empty) {
//     console.error('Chat non trovata per gli ID:', id1, id2);
//     return null;
//   }

//   // Ottieni la sottocollezione `messages` per eseguire la query
//   const messagesCollection = collection(chatDocRef, 'messages');

//   // Query per i primi n messaggi
//   const messagesQuery = query(
//     messagesCollection,
//     orderBy('timestamp', 'desc'),
//     limit(maxMsg) // Limita il numero di messaggi
//   );

//   const snapshot = await getDocs(messagesQuery);

//   const messages: Message[] = snapshot.docs.map((doc) => ({
//     sender: doc.data().sender,
//     text: doc.data().text,
//     timestamp: doc.data().timestamp,
//   }));

//   // Ottieni il cursore per il prossimo caricamento
//   const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

//   // Crea e restituisci l'oggetto Chat
//   const chat = new Chat(sortedId1, sortedId2, messages);
//   chat.cursor = lastVisible; // Imposta il cursore
//   return chat;
// }



export async function sendMessage(receiver: string, sender: string, text: string): Promise<void> {
  // Ordina gli ID per garantire che l'ordine sia sempre lo stesso
  const [sortedReceiver, sortedSender] = [receiver, sender].sort();

  // Genera l'ID del documento della chat
  const chatDocId = `${sortedReceiver}_${sortedSender}`;

  // Crea un riferimento al documento della chat
  const chatDocRef = doc(collection(db, 'chats'), chatDocId);

  // Crea un nuovo messaggio
  const newMessage: Message = {
    sender,
    text,
    timestamp: Date.now(),
  };

  // Aggiungi il nuovo messaggio all'array "messages" nel documento della chat
  try {
    await updateDoc(chatDocRef, {
      messages: arrayUnion(newMessage), // arrayUnion è usato per aggiungere senza duplicare
    });
    console.log('Messaggio inviato con successo');
  } catch (error) {
    console.error('Errore nell\'inviare il messaggio:', error);
  }
}