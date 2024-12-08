<script  lang="ts">
    import {createEventDispatcher} from 'svelte';
    
    const dispatch = createEventDispatcher();
    
      //flag di visibilità
      let {visibility,component,props}: {visibility:boolean,component:any,props: Record<string, any>} = $props();
  
      function close():void{
        visibility=false;
        //comunica evento di chiusura al padre
        dispatch('modal-closed',{text: "modal closed"});
      }
  </script>
  
  <style>
      .container{
        height: 90%;
        width: 100%;
        box-sizing: border-box;
      }
      .modal {
        display: grid;
        position: fixed;
        height: 80vh;
        width: 50vw;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 12px;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        text-align: center;
        grid-template-rows: 5% 95%;
        padding: 0.5%;
        box-sizing: border-box;
      }
    
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
      }
      .exit-button{
        width: 4%;
        height: 99%;
        border-radius: 50%;
        margin: 0px;
        padding: 0%;
        background-color: #ffff;
        box-sizing: border-box;
        cursor: pointer;
        display: grid;
        place-items: center;
      }
      .exit-button:hover{
        background-color: #d8ebe0;
      }
      .center{
        align-items: center; 
      }
    </style>
    
    {#if visibility}
      <div class="overlay"></div>
      <div class="modal">
        <div class="exit-button" onclick={close} onkeyup={close} role="button" tabindex= 0>
          <img class="center" src="/DefaultPics/XIcon.png" alt="">
        </div>
        {#if component}
          <!-- svelte-ignore svelte_component_deprecated -->
           <div class="container">
              <svelte:component this={component} {...props} />
           </div>
        {:else}
            <h1>Nessun componente specificato</h1>
        {/if}
      </div>
    {/if}