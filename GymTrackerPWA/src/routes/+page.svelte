<script lang="ts">
  import { onMount } from 'svelte';
  import { loginUser, logoutUser, registerUser, loginWithGoogle } from '../auth'; 
  import { auth } from '../firebase';
  import { onAuthStateChanged } from 'firebase/auth';
  import type { User } from 'firebase/auth';
  import type { UserCredential } from 'firebase/auth'; 
  import type {Utente} from '../globalState.svelte';

  import ChatList from '../lib/components/ChatList.svelte';
  import MainContent from '../lib/components/MainContent.svelte';
  import ResearchBar from '../lib/components/ResearchBar.svelte';

  import * as db from '../firestore';
  // import {stato} from '../globalState.svelte';
  import * as stato from '../globalState.svelte';

  let utente = stato.getUtente();

  // export const stato = creaUtente();

  let user: User | null = null;
  let email: string = '';
  let password: string = '';
  let error: string | null = null;

  let showRegisterForm = false;
  let registerEmail: string = '';
  let registerPassword: string = '';
  let registerError: string | null = null;
  let registerName: string = '';
  let registerBio: string = '';

  let userCred:UserCredential| null = null;

  //monitorare lo stato di autenticazione
  onMount(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user = currentUser;
    });
  });

  //funzione per il login con email e password
  async function handleLogin() {
    try {
      userCred = await loginUser(email, password);  //login
      error = null;

      if(userCred != null){
        let data: Utente | null = await(db.getUserData(userCred.user.uid));
        if(data != null)
          // stato.utente = data;
          // stato.setUtente(data);
          utente.email = "prova";
      }

    } catch (err) {
      if (err instanceof Error) {
        error = 'Errore durante il login: ' + err.message;
      } else {
        error = 'Errore sconosciuto durante il login';
      }
    }
  }

  //funzione per il logout
  async function handleLogout() {
    try {
      await logoutUser();   //logout
      user = null;
      stato.setUtente({
        uid: '',
        email: '',
        username: '',
        bio: '',
        friends: [],
        workouts: [],
        plans: [],
      })
    } catch (err) {
      if (err instanceof Error) {
        error = 'Errore durante il logout: ' + err.message;
      } else {
        error = 'Errore sconosciuto durante il logout';
      }
    }
  }

  //funzione per il login con Google
  async function handleLoginWithGoogle() {
    try {
      userCred = await loginWithGoogle();
      error = null;

      if(userCred != null){
        let data: Utente | null = await(db.getUserData(userCred.user.uid));
        if(data != null)
          // stato.utente = data;
          stato.setUtente(data);
      }

    } catch (err) {
      if (err instanceof Error) {
        error = 'Errore durante il login con Google: ' + err.message;
      } else {
        error = 'Errore sconosciuto durante il login con Google';
      }
    }
  }

  function toggleRegisterForm() {
    showRegisterForm = !showRegisterForm;
    registerError = null;
  }

  //funzione per la registrazione
  async function handleRegister() {
    if(registerName == ''){
      registerName = registerEmail.slice(0,registerEmail.search("@"));
    }

    if(registerBio == ''){
      registerBio = "";
    }

    console.log(registerName+" "+registerEmail);
    try {
      userCred = await registerUser(registerEmail, registerPassword, registerName, registerBio);
      registerError = null;
      showRegisterForm = false; //nasconde il form dopo la registrazione

      if(userCred != null){
        let data: Utente | null = await(db.getUserData(userCred.user.uid));
        if(data != null)
          // stato.utente = data;
          stato.setUtente(data);
      }

    } catch (err) {
      if (err instanceof Error) {
        registerError = 'Errore durante la registrazione: ' + err.message;
      } else {
        registerError = 'Errore sconosciuto durante la registrazione';
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
  .login-container {
    padding: 5%;
    display: grid;
    place-items: center;
    row-gap: 5px;
  }
  .input-field {
    margin-bottom: 10px;
    padding: 5px;
    width: 30%;
  }
  .error-message {
    color: red;
    margin-left: 2%; 
    font-style: normal;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 500;
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
  .google-icon {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
  .text {
    margin-left: 0%; 
    font-style: normal;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 500;
  }
</style>

<h1>{stato.getUtente().email}</h1>
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
  <div class="login-container">
    <h1 class="text">GymTracker</h1>
    <h2 class="text">Effettua il login</h2>
    <input class="input-field" type="email" bind:value={email} placeholder="Email" />
    <input class="input-field" type="password" bind:value={password} placeholder="Password" />

    {#if error}
      <p class="error-message">{error}</p>
    {/if}

    <button class="auth-button" onclick={handleLogin}>Login</button>
    <h5 class="text">Oppure</h5>
    <button class="auth-button" onclick={handleLoginWithGoogle}>
      <img src=".\DefaultPics\icons8-logo-di-google-48.png" alt="Google Logo" class="google-icon" />
      Login con Google
    </button>
    <button class="auth-button" onclick={toggleRegisterForm}>Registrati</button>

    <!-- form di registrazione  -->
    {#if showRegisterForm}
      <!-- <div class="login-container"> -->
        <h2 class="text">Registrazione:</h2>
        <input class="input-field" type="email" bind:value={registerEmail} placeholder="Email" />
        <input class="input-field" type="password" bind:value={registerPassword} placeholder="Password" />
        <input class="input-field" type="text" bind:value={registerName} placeholder="Username"/>
        <input class="input-field" type="text" bind:value={registerBio} placeholder="Bio" />
        {#if registerError}
          <p class="error-message">{registerError}</p>
        {/if}
        <button class="auth-button" onclick={handleRegister}>Crea Account</button>
      <!-- </div> -->
    {/if}

  </div>
{/if}
