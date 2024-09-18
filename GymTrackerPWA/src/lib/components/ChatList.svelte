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
    let chats: Chat[] = [];
    // let chats2: Chat[] = [];
  
    function createChats() {
      const defaultProPic = '/DefaultPics/ProfilePicture.jpg';
  
      for (let i = 0; i < 15; i++) {
        chats.push(new Chat(`Prova ${i + 1}`, defaultProPic));
      }
    }
    
    //popolo l'array dopo la creazione del DOM 
    onMount(() => {
      createChats();
      //forza l'aggiornamento dell'array dopo la creazione delle chat
      chats = [...chats];
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

</style>

<div class="chat-list">
    {#each chats as chat (chat.name)}
        <!-- {#if (chat === null)}
            <h1>Ciao</h1>
        {/if} -->
        <ChatButton propic={chat.propic} chatName={chat.name} />
    {/each}
</div>
