<script>
    import ChatList from '../lib/components/ChatList.svelte';
    import MainContent from '../lib/components/MainContent.svelte';
</script>

<style>
  .grid-container {
    display: grid;
    margin : 0%;
    height: 100vh;
    grid-template-columns: 70% 30%;
    padding: 0.5%;
    box-sizing: border-box;
  }
</style>

<div class="grid-container">
  <MainContent></MainContent>
  <ChatList></ChatList>
</div>
