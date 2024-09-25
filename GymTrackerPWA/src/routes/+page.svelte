<script lang="ts">
  import { onMount } from 'svelte';
  import { loginUser, logoutUser, registerUser, loginWithGoogle } from '../auth'; 
  import { auth } from '../firebase';
  import { onAuthStateChanged } from 'firebase/auth';
  import type { User } from 'firebase/auth';
  
  import ChatList from '../lib/components/ChatList.svelte';
  import MainContent from '../lib/components/MainContent.svelte';
  import ResearchBar from '../lib/components/ResearchBar.svelte';

  let user: User | null = null;
  let email: string = '';
  let password: string = '';
  let error: string | null = null;

  let showRegisterForm = false;
  let registerEmail: string = '';
  let registerPassword: string = '';
  let registerError: string | null = null;

  //monitorare lo stato di autenticazione
  onMount(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user = currentUser;
    });
  });

  //funzione per il login con email e password
  async function handleLogin() {
    try {
      await loginUser(email, password);  //login
      error = null;
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
      await loginWithGoogle();
      error = null;
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
    try {
      await registerUser(registerEmail, registerPassword); // Registra l'utente
      registerError = null;
      showRegisterForm = false; // Nascondi il form dopo la registrazione
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
      <img src=".\DefaultPics\icons8-logo-di-google-48.png" alt="Google Logo" class="google-icon" /> <!-- Aggiunge il logo di Google -->
      Login con Google
    </button>
    <button class="auth-button" onclick={toggleRegisterForm}>Registrati</button>

    <!-- form di registrazione  -->
    {#if showRegisterForm}
      <!-- <div class="login-container"> -->
        <h2 class="text">Registrazione:</h2>
        <input class="input-field" type="email" bind:value={registerEmail} placeholder="Email" />
        <input class="input-field" type="password" bind:value={registerPassword} placeholder="Password" />
        {#if registerError}
          <p class="error-message">{registerError}</p>
        {/if}
        <button class="auth-button" onclick={handleRegister}>Crea Account</button>
      <!-- </div> -->
    {/if}

  </div>
{/if}
