<script lang="ts">
	import { getUserDataAsFriend } from '../../firestore';
	import { defaultPic, Friend, removeFriend } from '../../globalState.svelte';

    let {friend}: {friend:string} = $props();

    let f:Friend=$state(new Friend());
    let loading:boolean = $state(true);
    let data:boolean = $state(false);

    async function getFriend(id:string){
    let x:Friend|null = await getUserDataAsFriend(id);
    if(!x){
      x=new Friend();
      x.propic=defaultPic;
      x.uid="";
      x.username="Utente non trovato";
      f=x;
      data=true;
    }

    if(x.propic == null || x.propic == undefined || x.propic==""){
      x.propic=defaultPic;
    }

    data = true;
    f=x;
  }

    import Chat from './Chat.svelte';
	import Loading from './Loading.svelte';
    import Modal from "./Modal.svelte";
	  import ProfileInfo from './ProfileInfo.svelte';
    //flag per il caricamento della chat e del profilo
    let chatVisible:boolean = $state(false); 
    let profileVisibility:boolean = $state(false); 

    // let bio:string = $state("bio di prova da cambiare in ChatButton");

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

    function handleAction(): void {
        removeFriend(f.uid);
    }

    function confirmAction(): void {
        if (confirm("Non sarà possibile recuperare la chat.\nConfermi di voler cancellare l'amicizia con "+f.username+"?")) {
            handleAction();
        } else {
            console.log("Operazione annullata.");
        }
    }

    $effect(()=>{
      getFriend(friend);
      loading = !(data);
    })
</script>
  
  <style>
    .box {
      display: grid;
      align-items: center; 
      background-color: #e3f1e9;
      height: 11%;
      width: 100%;
      padding: 2%;
      box-sizing: border-box;
      transition: background-color 0.05s;
      cursor: pointer;
      grid-template-columns: 10% 80% 10%;
    }
    .box:hover{
        background-color: #d8ebe0;
    }
    .pro-pic {
      height: 100%;
      width: 100%;
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
    .action-btn {
      padding: 10%;
        height: 70%;
        width: 70%;
        cursor: pointer;
        border-radius: 50%;
        align-self: center;
    }
    .action-btn:hover{
      background-color: #c8dacf;
    }
  </style>

  <div class="box" onclick={triggerChat} onkeyup={triggerChat} role="button" tabindex="0">
    {#if loading}
      <Loading></Loading>
    {:else}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <img class="pro-pic" src={f.propic} alt={defaultPic} 
    onclick={event => {
      event.stopPropagation();
      triggerProfile();
    }}>
    <h3 class="text">{f.username}</h3>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img 
        class="action-btn" 
        src="/DefaultPics/XIcon.png"
        alt="Delete Icon" 
        onclick={event => {
            event.stopPropagation();
            confirmAction();
        }}>
    {/if}
  </div>

  <!-- carico la chat solo se viene aperta -->
  {#if chatVisible}
  <!-- assegno handler evento chiusura chat -->
    <!-- <Chat visibility={chatVisible} on:chat-closed={handleChatClosure}/> -->
    <Modal visibility={chatVisible} component={Chat} props={{f}} on:modal-closed={handleClosure}></Modal>
  {/if}

  {#if profileVisibility}
  <!-- assegno handler evento chiusura chat -->
    <!-- <Chat visibility={profileVisibility} on:chat-closed={handleChatClosure}/> -->
    <Modal visibility={profileVisibility} component={ProfileInfo} props={{propic:f.propic,userName:f.username,bio:""}} on:modal-closed={handleClosureInfo}></Modal>
  {/if}
  