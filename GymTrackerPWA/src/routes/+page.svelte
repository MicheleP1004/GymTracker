<script>
    // Importa eventuali componenti se li hai già creati
    import ChatList from '../lib/components/ChatList.svelte';
    import MainContent from '../lib/components/MainContent.svelte';
</script>

<style>
  .grid-container {
    display: grid;
    height: 100vh;
    grid-template-columns: 2fr 1fr;
    grid-gap: 10px;
  }

  .main-content {
    background-color: #f8f8f8;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }

  .chat-list {
    background-color: #ffffff;
    padding: 20px;
    border-left: 1px solid #ddd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }
</style>

<div class="grid-container">
  <div class="main-content">
    <slot name="main"></slot>
  </div>

  <div class="chat-list">
    <slot name="chat-list"></slot>
  </div>
</div>
