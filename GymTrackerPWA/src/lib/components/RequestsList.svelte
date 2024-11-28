<script lang="ts">
    // import WorkoutButton from './WorkoutButton.svelte';
    import {stato} from '../../globalState.svelte';
	import RequestButton from './RequestButton.svelte';
</script>

<style>
  .request-list {
    background-color: #ffffff;
    padding: 0%;
    height: 100%;
    width: 100%;
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

<div class="request-list">
    {#each stato.requests as r}
        <RequestButton sender={r}></RequestButton>
    {/each}
    <p class="text">Non sono presenti altre richieste di amicizia</p>
</div>