<script>
    // Importa eventuali componenti se li hai già creati
    import ChatList from '../lib/components/ChatList.svelte';
    import MainContent from '../lib/components/MainContent.svelte';
</script>

<style>
  .grid-container {
    display: grid;
    margin : 0%;
    height: 100vh;
    grid-template-columns: 2fr 1fr;
    padding: 0.5%;
    box-sizing: border-box;
  }

  .main-content {
    background-color: #ffffff;
    padding: 0px;
    overflow-y: auto;
  }
</style>

<div class="grid-container">
  <div class="main-content">
    <slot name="main"></slot>
  </div>

  <ChatList></ChatList>
</div>
