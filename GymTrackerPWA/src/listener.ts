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

/**
 * Avvia un listener su una chat in Firestore.
 * @param chatKey - La chiave univoca della chat.
 * @param onUpdate - Funzione callback per aggiornare i dati della chat.
 * @returns Una funzione per interrompere il listener.
 */
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

/**
 * Interrompe un listener Firestore.
 * @param unsubscribe - La funzione per interrompere il listener.
 */
export function stopChatListener(unsubscribe: () => void): void {
  unsubscribe();
}

/**
 * Recupera una chat da Firestore.
 * @param id1 - ID del primo utente.
 * @param id2 - ID del secondo utente.
 * @returns Un'istanza della chat o null se non trovata.
 */
export async function fetchChat(
  id1: string,
  id2: string
): Promise<Chat | null> {
  const chatKey = [id1, id2].sort().join(":");
  console.log(`Fetching chat: ${chatKey}`);
  // Simula il recupero di dati da Firestore
  return new Chat(id1, id2, []); // Sostituisci con il fetch reale
}
