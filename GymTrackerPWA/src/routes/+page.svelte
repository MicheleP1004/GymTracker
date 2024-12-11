<script lang="ts">
  import { onMount } from 'svelte';
  import { logoutUser} from '../auth'; 
  import { auth, vapidKey } from '../firebase';
  // import { requestNotificationPermission } from '../firebase';
  import { onAuthStateChanged} from 'firebase/auth';
  import type { User } from 'firebase/auth';

  import type {Utente} from '../globalState.svelte';

  import FriendList from '../lib/components/FriendList.svelte';
  import MainContent from '../lib/components/MainContent.svelte';
  import ResearchBar from '../lib/components/ResearchBar.svelte';

  import * as db from '../firestore';
  import {printUtente, setUtente, stato} from '../globalState.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Login from '$lib/components/Login.svelte';
	import Modal from '$lib/components/Modal.svelte';
  import RequestsList from '$lib/components/RequestsList.svelte';
	import { startUserListener, stopUserListener } from '../listener';
	import { storeFCMToken } from '../firestore';
	import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';

  let loading:boolean = $state(true);

  let user: User | null = $state(null);
  let requestsVisibility:boolean = $state(false);
  let error: string | null = null;
  let pic:string = "/DefaultPics/icons8-richiesta-feedback-48.png";

  let messaging:Messaging;

  //monitorare lo stato di autenticazione
  onMount(() => {
    onAuthStateChanged(auth, (currentUser) => {
  if (currentUser && !user) {
    user = currentUser;

    setter(user.uid).then(() => {
      //una volta che i dati dell'utente sono stati caricati richiede il permesso per le notifiche
      if (typeof window !== 'undefined') {
        messaging = getMessaging();
        requestNotificationPermission(user!.uid).catch((error) => {
          console.error("Errore durante la richiesta di permesso notifiche:", error);
        });
      }
    });

    loading = false;
  } else {
    loading = false;
  }
});
  });

  //funzione di richiesta permesso per le notifiche
  export async function requestNotificationPermission(id: string) {
    // if (stato.pushToken) {
    //   console.log("Token FCM già presente:", stato.pushToken);
    //   return;
    // }

  //controlla se il browser supporta le notifiche
  if ('Notification' in window) {
    //chiedi il permesso per le notifiche
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Permesso per le notifiche ricevuto');

      //controlla se il browser supporta i service worker
      if ('serviceWorker' in navigator) {
        try {
          //aspetta che il service worker sia pronto
          const registration = await navigator.serviceWorker.ready;

          if (registration.active) {
            console.log('Service Worker attivo e pronto');

            //ottieni il token FCM
            const token = await getToken(messaging, {
              vapidKey: vapidKey
            });

            if (token && token !== stato.pushToken) {
              console.log("Token FCM ricevuto:", token);

              //salva il token nel database Firestore
              await storeFCMToken(id, token);
              stato.pushToken=token;
              console.log("Token salvato nel database.");
            } else {
              console.log("Token già presente o impossibile da ottenere.");
            }
          } else {
            console.error('Il Service Worker non è attivo');
          }
        } catch (error) {
          console.error("Errore durante il recupero del token FCM:", error);
        }
      } else {
        console.error('Il browser non supporta i service worker o FCM');
      }
    } else {
      console.error('Permesso notifiche negato');
    }
  } else {
    console.error('Le notifiche non sono supportate dal browser');
  }
}


//listener per notifiche in foreground
export function setupForegroundNotifications() {
  onMessage(messaging, (payload) => {
    console.log("Notifica ricevuta in foreground:", payload);
  });
}

async function setter(id: string): Promise<void> {
  try {
    const data: Utente | null = await db.getUserData(id);
    if (data != null) {
      setUtente(data);
      startUserListener();
    } else {
      console.error("Dati utente non trovati.");
    }
  } catch (error) {
    console.error("Errore durante il recupero dei dati utente:", error);
  }
}

  //funzione per il logout
  async function handleLogout() {
    try {
      await logoutUser();   //logout
      user = null;
      stopUserListener();
      setUtente({
        uid: '',
        email: '',
        username: '',
        bio: '',
        friends: [],
        workouts: [],
        plans: [],
        propic: "/DefaultPics/ProfilePicture.jpg",
        requests:[],
        pushToken:'',
      });
    } catch (err) {
      if (err instanceof Error) {
        error = 'Errore durante il logout: ' + err.message;
      } else {
        error = 'Errore sconosciuto durante il logout';
      }
    }
  }

  function triggerRequests():void{
      requestsVisibility = !requestsVisibility;
    }

    //handler chiusura chat
    function handleClosure(){
      requestsVisibility = false;
    }
</script>

<style>
  .grid-container {
    display: grid;
    margin: 0%;
    height: 90vh;
    grid-template-columns: 70% 30%;
    grid-template-rows: 1fr 12% ;
    padding: 0.5%;
    box-sizing: border-box;
  }
  .top-bar {
    display: grid;
    margin: 0%;
    height: 10vh;
    grid-template-columns: 55% 5% 10% 30%;
    padding: 0.5%;
    box-sizing: border-box;
  }
  .text {
    font-family: Arial, Helvetica, sans-serif;
  }
  .auth-button {
    border-radius: 12px;
    background-color: white;
    border-width: 0px;
    padding: 10px 20px; 
    width: 31%; 
    font-size: 1.2em; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    cursor: pointer;
  }
  .auth-button:hover {
    background-color: rgb(238, 238, 238);
  }
  .text {
    margin-left: 0%; 
    font-style: normal;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 500;
  }
  .pic{
    border-radius: 12px;
    background-color: white;
    border-width: 0px;
    padding: 10px 20px; 
    display: flex; 
    align-self: center; 
    justify-content: center;
    cursor: pointer;
    box-sizing: border-box;
  }
  .pic:hover {
    background-color: rgb(238, 238, 238);
  }
</style>

{#if loading}
  <Loading></Loading>
{:else}
  {#if user}
    <div class="top-bar">
      <h1 class="text">GymTracker</h1>
      <p></p>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <img class="pic" src={pic} alt="Default" onclick={triggerRequests}>
      <ResearchBar></ResearchBar>
    </div>
    <div class="grid-container">
      <MainContent></MainContent>
      <FriendList></FriendList>
      <button class="auth-button" onclick={handleLogout}>Logout</button>
    </div>
  {:else}
    <Login></Login>
  {/if}
{/if}

{#if requestsVisibility}
    <Modal visibility={requestsVisibility} component={RequestsList} props={{}} on:modal-closed={handleClosure}></Modal>
  {/if}
