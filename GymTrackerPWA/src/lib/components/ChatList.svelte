<script>
    // Potresti mettere qui la logica per gestire la lista delle chat
    import ChatButton from "./ChatButton.svelte";
</script>

<style>
  /* Stile specifico per la lista delle chat */
  .chat-list {
    background-color:#ffffff;
    padding: 5px;
    overflow-y: auto;
  }
</style>

<div class="chat-list">
    <ChatButton></ChatButton>
</div>
