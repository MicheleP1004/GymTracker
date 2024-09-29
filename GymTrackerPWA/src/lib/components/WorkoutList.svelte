<script lang="ts">
    import { onMount } from 'svelte';
    import WorkoutButton from './WorkoutButton.svelte';
    import * as state from '../../globalState.svelte';
  
    class Workout {
      date: string;
      plan: string;
      id:number;
  
      constructor(date: string, plan: string, id:number) {
        this.date = date;
        this.plan = plan;
        this.id = id;
      }
    }
  
    //array di prova
    // const state = $state({workouts:[] as Workout[]});
    // let Workouts2: Workout[] = [];

    
  
    // function createWorkouts() {
    //   const defaultDate = new Date().toLocaleDateString().toString();
    // // const defaultDate = "ciao";
    //   let tempWorkouts:Workout[] = [];
    //   for (let i = 0; i < 15; i++) {
    //     tempWorkouts.push(new Workout(defaultDate,`Piano: ${i + 1}`,i));
    //   }
    //   state.workouts = tempWorkouts;
    // }
    
    //popolo l'array dopo la creazione del DOM 
    onMount(() => {
      // createWorkouts();
    });
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
    {#each state.stato.workouts as Workout (Workout.id)}
        <WorkoutButton date={Workout.date} plan={Workout.plan} />
    {/each}
    <p class="text">Non sono presenti altri allenamenti</p>
</div>
