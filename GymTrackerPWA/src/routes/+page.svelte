<script lang="ts">
  import { onMount } from 'svelte';
  import { logoutUser} from '../auth'; 
  import { auth } from '../firebase';
  import { onAuthStateChanged} from 'firebase/auth';
  import type { User } from 'firebase/auth';

  import type {Utente} from '../globalState.svelte';

  import FriendList from '../lib/components/FriendList.svelte';
  import MainContent from '../lib/components/MainContent.svelte';
  import ResearchBar from '../lib/components/ResearchBar.svelte';

  import * as db from '../firestore';
  import {setUtente} from '../globalState.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Login from '$lib/components/Login.svelte';
	import Modal from '$lib/components/Modal.svelte';
  import RequestsList from '$lib/components/RequestsList.svelte';
	import { startUserListener, stopUserListener } from '../listener';

  let loading:boolean = $state(true);


  let user: User | null = $state(null);
  let requestsVisibility:boolean = $state(false);
  let error: string | null = null;
  let pic:string = "/DefaultPics/icons8-richiesta-feedback-48.png";

  //monitorare lo stato di autenticazione
  onMount(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if(currentUser && !user){
        user = currentUser;
        setter(user.uid);
        loading = false;
      }else{
        loading = false;
      }
    });
  });



  async function setter(id:string){
    let data: Utente | null = await(db.getUserData(id));
      if(data != null){
        setUtente(data);
        startUserListener();
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
    <!-- <Chat visibility={requestsVisibility} on:chat-closed={handleChatClosure}/> -->
    <Modal visibility={requestsVisibility} component={RequestsList} props={{}} on:modal-closed={handleClosure}></Modal>
  {/if}
