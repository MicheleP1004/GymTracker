<script lang="ts">
    // export let propic: string;
    // export let chatName: string;

    let {propic, chatName}: {propic:string, chatName:string} = $props();

    import Chat from './Chat.svelte';
    //flag per il caricamento della chat
    let chatVisible:boolean = $state(false); 

    function triggerChat():void{
      chatVisible = !chatVisible;
    }

    //handler chiusura chat
    function handleChatClosure(){
      chatVisible = false;
    }
</script>
  
  <style>
    .box {
      display: flex;
      align-items: center; 
      background-color: #e3f1e9;
      height: 11%;
      width: 100%;
      padding: 2%;
      box-sizing: border-box;
      transition: background-color 0.05s;
      cursor: pointer;
    }
    .box:hover{
        background-color: #d8ebe0;
    }
    .pro-pic {
      height: 100%;
      width: 11%;
      border-radius: 50%;
      object-fit: cover;
    }
    .text {
      margin-left: 2%; 
      font-style: normal;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 500;
    }
  </style>

  <div class="box" onclick={triggerChat} onkeyup={triggerChat} role="button" tabindex="0">
    <img class="pro-pic" src={propic} alt="Default">
    <h3 class="text">{chatName}</h3>
  </div>

  <!-- carico la chat solo se viene aperta -->
  {#if chatVisible}
  <!-- assegno handler evento chiusura chat -->
    <Chat visibility={chatVisible} on:chat-closed={handleChatClosure}/>
  {/if}
  