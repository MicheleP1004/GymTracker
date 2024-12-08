import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { Chat, stato, updateFriends, updateRequests, type Message } from "./globalState.svelte";

let unsubscribe: () => void;

export function startUserListener() {
  if (stato.uid) {
    const userDocRef = doc(db, 'users', stato.uid);

    unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        if (data.modifiedBy !== stato.uid) {
          if ('friends' in data) {
            updateFriends(data.friends);
          }
          if ('requests' in data) {
            updateRequests(data.requests);
          }
        } else {
          console.log("Modifica fatta da se stessi, ignorata.");
        }
      } else {
        console.log('Documento utente non trovato.');
      }
    }, (error) => {
      console.error("Errore nel listener Firestore:", error);
    });
    console.log("Listener avviato");
  } else {
    console.log("UID non disponibile al momento del caricamento del listener");
  }
}

export function stopUserListener() {
  if (unsubscribe) {
    unsubscribe();
    console.log("Listener rimosso");
  }
}

export function startChatListener(
  chatKey: string,
  onUpdate: (updatedChat: Chat) => void
): () => void {
  const chatDocRef = doc(db, "chats", chatKey);

  const unsubscribe = onSnapshot(
    chatDocRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as { messages: Message[] };
        const chat = new Chat(chatKey.split("_")[0], chatKey.split("_")[1], data.messages);
        onUpdate(chat);
      } else {
        console.log(`Documento per la chat ${chatKey} non trovato.`);
      }
    },
    (error) => {
      console.error(`Errore nel listener della chat ${chatKey}:`, error);
    }
  );

  return unsubscribe;
}

export function stopChatListener(unsubscribe: () => void): void {
  unsubscribe();
}

