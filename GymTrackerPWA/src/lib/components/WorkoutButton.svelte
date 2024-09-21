<script lang="ts">
	import WorkoutDetails from "./WorkoutDetails.svelte";

    let {date, plan}: {date:string, plan:string} = $props();

    // import Chat from './Chat.svelte';
    //flag per il caricamento della chat
    let detailsVisibility:boolean = $state(false);
    let listData: string = plan+" Registrato in data:"+date; 

    function triggerDetails():void{
      detailsVisibility = !detailsVisibility;
    }

    //handler chiusura finestra
    function handleClosure(){
      detailsVisibility = false;
    }
</script>
  
  <style>
    .box {
      display: flex;
      align-items: center; 
      background-color: #e3f1e9;
      height: 11%;
      width: 100%;
      padding: 1%;
      box-sizing: border-box;
      transition: background-color 0.05s;
      cursor: pointer;
    }
    .box:hover{
        background-color: #d8ebe0;
    }
    .text {
      margin-left: 2%; 
      font-style: normal;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 500;
    }
  </style>

  <div class="box" onclick={triggerDetails} onkeyup={triggerDetails} role="button" tabindex="0">
    <p class="text">{listData}</p>
  </div>

  <!-- carico la chat solo se viene aperta -->
  {#if detailsVisibility}
  <!-- assegno handler evento chiusura chat -->
    <WorkoutDetails visibility={detailsVisibility} on:details-closed={handleClosure}/>
  {/if}
  