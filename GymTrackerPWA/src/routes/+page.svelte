<script lang="ts">
  import { onMount } from 'svelte';
  import { logoutUser} from '../auth'; 
  import { auth } from '../firebase';
  import { onAuthStateChanged} from 'firebase/auth';
  import type { User } from 'firebase/auth';

  import type {Utente} from '../globalState.svelte';

  import ChatList from '../lib/components/ChatList.svelte';
  import MainContent from '../lib/components/MainContent.svelte';
  import ResearchBar from '../lib/components/ResearchBar.svelte';

  import * as db from '../firestore';
  import {setUtente} from '../globalState.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Login from '$lib/components/Login.svelte';

  let loading:boolean = $state(true);


  let user: User | null = $state(null);
  let error: string | null = null;

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
      }
  }

  //funzione per il logout
  async function handleLogout() {
    try {
      await logoutUser();   //logout
      user = null;
      setUtente({
        uid: '',
        email: '',
        username: '',
        bio: '',
        friends: [],
        workouts: [],
        plans: [],
        propic: "/DefaultPics/ProfilePicture.jpg"
      });
    } catch (err) {
      if (err instanceof Error) {
        error = 'Errore durante il logout: ' + err.message;
      } else {
        error = 'Errore sconosciuto durante il logout';
      }
    }
  }
</script>

<style>
  .grid-container {
    display: grid;
    margin: 0%;
    height: 90vh;
    grid-template-columns: 70% 30%;
    padding: 0.5%;
    box-sizing: border-box;
  }
  .top-bar {
    display: grid;
    margin: 0%;
    height: 10vh;
    grid-template-columns: 70% 30%;
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
</style>

{#if loading}
  <Loading></Loading>
{:else}
  {#if user}
    <div class="top-bar">
      <h1 class="text">GymTracker</h1>
      <ResearchBar></ResearchBar>
    </div>
    <div class="grid-container">
      <MainContent></MainContent>
      <ChatList></ChatList>
      <button class="auth-button" onclick={handleLogout}>Logout</button>
    </div>
  {:else}
    <Login></Login>
  {/if}
{/if}
