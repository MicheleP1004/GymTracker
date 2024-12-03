<script lang="ts">
  import { sendMessage } from "../../firestore";
  import { Chat, chats, stato, type Friend } from "../../globalState.svelte";
  import Loading from "./Loading.svelte";

  let { f }: { f: Friend } = $props();
  let chat: Chat | null = $state(null);
  let loading: boolean = $state(true);
  let newMessage: string = $state(''); 

  async function loadChat() {
    try {
      chat = await chats.addChat(stato.uid, f.uid);
    } catch (error) {
      console.error("Errore nel caricamento della chat:", error);
    } finally {
      loading = false;
    }
  }

  function send() {
    if (newMessage.trim() !== '') {
      sendMessage(f.uid, stato.uid, newMessage);
      newMessage = '';
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      send();
    }
  }

  function formatDate(timestamp: number) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('it-IT');
  }

  function scrollToBottom() {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  $effect(() => {
    loadChat();
  });

  //scroll automatico quando la chat viene aggiornata
  $effect(() => {
    if (chat) {
      scrollToBottom();
    }
  });
</script>

<style>
  .chat-container {
    display: grid;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: #ffffff;
    overflow: hidden; 
    box-sizing: border-box;
    grid-template-rows: 10% 80% 10%;
  }

  .messages-container {
    overflow-y: auto; 
    padding: 1%;
    width: 100%;
    display: flex;
    scrollbar-width: none;
    flex-direction: column-reverse; /* mostra i messaggi dal basso verso l'alto */
    box-sizing: border-box;
  }

  .message {
    margin: 1px;
    padding: 1%;
    border-radius: 12px;
    max-width: 50%;
    word-wrap: break-word;
    white-space: pre-wrap; /* evita che il testo sbordi */
    box-sizing: border-box;
  }

  .sent {
    align-self: flex-end;
    background-color: #daf8cb;
  }

  .received {
    align-self: flex-start;
    background-color: #e9ecef;
  }

  h1 {
    text-align: center;
  }

  .input-container {
    display: flex;
    justify-content: space-between;
    padding: 1%;
    background-color: #f8f9fa;
    border-top: 1px solid #ddd;
    position: sticky;
    bottom: 0;
    width: 100%;
    background-color: #ffffff;
    z-index: 1;
    box-sizing: border-box;
  }

  .input-container input {
    width: 80%;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  .input-container button {
    padding: 0.5rem;
    border-radius: 4px;
    background-color: #468f58;
    color: white;
    border: none;
    cursor: pointer;
  }

  .input-container button:disabled {
    background-color: #aaa;
  }

  .text{
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

{#if loading}
  <Loading></Loading>
{:else}
  <div class="chat-container">
    {#if chat}
      <h1 class="text">{f.username}</h1>

      <div class="messages-container" id="messages-container">
        {#each chat?.messages.toReversed() as message (message.timestamp)}
          <div class="message {message.sender === stato.uid ? 'sent' : 'received'}">
            <p class="text">{message.text}</p>
            <small>{formatDate(message.timestamp)}</small>
          </div>
        {/each}
      </div>

      <div class="input-container">
        <input
          type="text"
          bind:value={newMessage}
          onkeydown={handleKeyPress}
          placeholder="Scrivi un messaggio..."
        />
        <button onclick={send} disabled={newMessage.trim() === ''}>Invia</button>
      </div>

    {:else}
      <h1 class="text">Si è verificato un errore</h1>
    {/if}
  </div>
{/if}
