<script lang="ts">
    import type { UserCredential } from 'firebase/auth';
    import type {Utente} from '../../globalState.svelte';

    import { loginUser, registerUser, loginWithGoogle } from '../../auth';
    import * as db from '../../firestore';
    import {setUtente} from '../../globalState.svelte';
	import { startUserListener } from '../../listener';

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

    //funzione per il login con email e password
  async function handleLogin() {
    try {
      userCred = await loginUser(email, password);  //login
      error = null;

      if(userCred != null){
        let data: Utente | null = await(db.getUserData(userCred.user.uid));
        if(data != null){
          setUtente(data);
          // startUserListener();
        }
      }

    } catch (err) {
      if (err instanceof Error) {
        error = 'Errore durante il login: ' + err.message;
      } else {
        error = 'Errore sconosciuto durante il login';
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
        if(data != null){
          setUtente(data);
          // startUserListener();
        }
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

    try {
      userCred = await registerUser(registerEmail, registerPassword, registerName, registerBio,file);
      registerError = null;
      showRegisterForm = false; //nasconde il form dopo la registrazione

      if(userCred != null){
        let data: Utente | null = await(db.getUserData(userCred.user.uid));
        if(data != null){
          setUtente(data);
          // startUserListener();
          }
      }

    } catch (err) {
      if (err instanceof Error) {
        registerError = 'Errore durante la registrazione: ' + err.message;
      } else {
        registerError = 'Errore sconosciuto durante la registrazione';
      }
    }
  }

  //variabili per drag and drop
  let file:File | null = null;
  let isDragging: boolean = false;
  let errorMessage: string = '';

  //gestione drag and drop per immagine profilo
  const handleDrop = (event:DragEvent) => {
    event.preventDefault();
    isDragging = false;
    errorMessage = ''; 
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      console.log('File trascinato:', droppedFile);

      if (droppedFile.type.startsWith("image/")) {
        file = droppedFile;
        console.log('File immagine accettato:', file);
      } else {
        file = null;
        errorMessage = 'Solo file di immagine sono accettati!';
        console.error(errorMessage);
      }
    }
  };

  const handleDragOver = (event:DragEvent) => {
    event.preventDefault(); 
    isDragging = true; 
  };

  const handleDragLeave = () => {
    isDragging = false; 
  };
</script>

<style>
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
  .is-dragging {
    border-color: rgb(0, 0, 0);
    background-color: #f0f0f0;
  }
</style>

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
        <h2 class="text">Registrazione:</h2>
        <input class="input-field" type="email" bind:value={registerEmail} placeholder="Email" />
        <input class="input-field" type="password" bind:value={registerPassword} placeholder="Password" />
        <input class="input-field" type="text" bind:value={registerName} placeholder="Username"/>
        <input class="input-field" type="text" bind:value={registerBio} placeholder="Bio" />
        {#if registerError}
          <p class="error-message">{registerError}</p>
        {/if}
          <div role = "button" tabindex="0"
          class:is-dragging={isDragging}
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
          ondrop={handleDrop}
          style="border: 2px dashed #ccc; width: 300px; height: 200px; display: flex; align-items: center; justify-content: center; text-align: center; cursor: pointer;">
        {#if file}
          <p>{file.name}</p>
        {:else}
          <p class="text">Trascina qui il file immagine</p>
        {/if}
      </div>
      {#if errorMessage}
      <p style="color: red;">{errorMessage}</p>
      {/if}

        <button class="auth-button" onclick={handleRegister}>Crea Account</button>
    {/if}

  </div>