<script lang="ts">
    import ChatButton from './ChatButton.svelte';
	  import { stato } from '../../globalState.svelte';
</script>

<style>
  .friend-list {
    background-color: #e3f1e9;
    padding: 0%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    /* overflow: auto; */
    border-radius: 12px;
    box-sizing: border-box;
    scrollbar-width: none;
  }
  .text{
    padding: 10px;
    align-self: center;
    color: #3f3f3f;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

<div class="friend-list">
    {#each stato.friends as f}
        <ChatButton friend={f}/>
    {/each}
    <p class="text">Non sono presenti altri amici</p>
</div>
