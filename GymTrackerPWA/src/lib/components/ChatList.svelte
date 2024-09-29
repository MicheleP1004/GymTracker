<script lang="ts">
    import { onMount } from 'svelte';
    import ChatButton from './ChatButton.svelte';
  
    class Chat {
      name: string;
      propic: string;
  
      constructor(name: string, propic: string) {
        this.name = name;
        this.propic = propic;
      }
    }
  
    //array di prova
    const state = $state({chats:[] as Chat[]});
    // let chats2: Chat[] = [];
  
    function createChats() {
      const defaultProPic = '/DefaultPics/ProfilePicture.jpg';
      let tempChats:Chat[] = [];
      for (let i = 0; i < 15; i++) {
        tempChats.push(new Chat(`Prova ${i + 1}`, defaultProPic));
      }
      state.chats = tempChats;
    }
    
    //popolo l'array dopo la creazione del DOM 
    onMount(() => {
      createChats();
    });
</script>

<style>
  .chat-list {
    background-color: #e3f1e9;
    padding: 0%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    /* overflow: auto; */
    border-radius: 12px;
    box-sizing: border-box;
    scrollbar-width: none;
  }
  .text{
    padding: 10px;
    align-self: center;
    color: gray;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

<div class="chat-list">
    {#each state.chats as chat (chat.name)}
        <ChatButton propic={chat.propic} chatName={chat.name} />
    {/each}
    <p class="text">Non sono presenti altre chat</p>
</div>
