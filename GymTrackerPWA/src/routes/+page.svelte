<script lang="ts">
    import ChatList from '../lib/components/ChatList.svelte';
    import MainContent from '../lib/components/MainContent.svelte';
    import ResearchBar from '../lib/components/ResearchBar.svelte';

    class UserData{
      userName: string;
      propic: string;

      constructor(name:string, propic:string){
        this.userName=name;
        this.propic=propic;
      }
    }
</script>

<style>
  .grid-container {
    display: grid;
    margin : 0%;
    height: 90vh;
    grid-template-columns: 70% 30%;
    padding: 0.5%;
    box-sizing: border-box;
  }
  .top-bar{
    display: grid;
    margin : 0%;
    height: 10vh;
    grid-template-columns: 70% 30%;
    padding: 0.5%;
    box-sizing: border-box;
  }
  .text{
        font-family: Arial, Helvetica, sans-serif;
    }
</style>

<div class="top-bar">
  <h1 class="text">GymTracker</h1>
  <ResearchBar></ResearchBar>
</div>
<div class="grid-container">
  <MainContent></MainContent>
  <ChatList></ChatList>
</div>
