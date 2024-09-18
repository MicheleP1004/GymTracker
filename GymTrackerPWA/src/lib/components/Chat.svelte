<script  lang="ts">
    export let visibility:boolean;
</script>

<style>
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 1000; /* Assicura che sia sopra tutto il resto */
      width: 300px;
      text-align: center;
    }
  
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5); /* Sfondo trasparente scuro */
      z-index: 999; /* Dietro la finestra modale */
    }
  </style>
  
  {#if visibility}
    <div class="overlay"></div>
    <div class="modal">
      <slot></slot>
    </div>
  {/if}