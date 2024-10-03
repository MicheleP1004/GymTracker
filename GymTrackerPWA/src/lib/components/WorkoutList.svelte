<script lang="ts">
    import WorkoutButton from './WorkoutButton.svelte';
    import {stato} from '../../globalState.svelte';
</script>

<style>
  .workout-list {
    background-color: #e3f1e9;
    padding: 0%;
    height: 100%;
    width: 70%;
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
    color: gray;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

<div class="workout-list">
    {#each stato.workouts as a}
        <WorkoutButton date={a.date} plan={a.plan}/>
    {/each}
    <p class="text">Non sono presenti altri allenamenti</p>
</div>
