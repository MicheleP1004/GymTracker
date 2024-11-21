<script lang="ts">
    // export let propic: string;
    // export let chatName: string;


    let {propic, chatName}: {propic:string, chatName:string} = $props();

    import Chat from './Chat.svelte';
    import Modal from "./Modal.svelte";
	  import ProfileInfo from './ProfileInfo.svelte';
    //flag per il caricamento della chat e del profilo
    let chatVisible:boolean = $state(false); 
    let profileVisibility:boolean = $state(false); 

    let bio:string = $state("bio di prova da cambiare in ChatButton");

    function triggerChat():void{
      chatVisible = !chatVisible;
    }

    //handler chiusura chat
    function handleClosure(){
      chatVisible = false;
    }

    function triggerProfile():void{
      profileVisibility = !profileVisibility;
    }

    //handler chiusura profilo
    function handleClosureInfo(){
      profileVisibility = false;
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
      cursor: pointer;
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
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <img class="pro-pic" src={propic} alt="Default" 
    onclick={event => {
      event.stopPropagation();
      triggerProfile();
    }}>
    <h3 class="text">{chatName}</h3>
  </div>

  <!-- carico la chat solo se viene aperta -->
  {#if chatVisible}
  <!-- assegno handler evento chiusura chat -->
    <!-- <Chat visibility={chatVisible} on:chat-closed={handleChatClosure}/> -->
    <Modal visibility={chatVisible} component={Chat} props={{propic,chatName}} on:modal-closed={handleClosure}></Modal>
  {/if}

  {#if profileVisibility}
  <!-- assegno handler evento chiusura chat -->
    <!-- <Chat visibility={profileVisibility} on:chat-closed={handleChatClosure}/> -->
    <Modal visibility={profileVisibility} component={ProfileInfo} props={{propic,chatName,bio}} on:modal-closed={handleClosureInfo}></Modal>
  {/if}
  