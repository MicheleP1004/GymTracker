<script lang="ts">
    import Loading from "./Loading.svelte";
    import {stato} from "../../globalState.svelte"
    import {fetchEsercizi, fetchSchede, fetchWorkouts, getWorkout, delWorkout, type Workout} from "../../data.svelte";
	import { onMount } from "svelte";

    import {flags} from "../../data.svelte";

    let {plan,date}: {plan:string,date:string} = $props();

    // let loading: boolean = $state(true);
    let loading: boolean = $state(true);
    let deleted:boolean = $state(false);

    let workoutData:Workout;

    let appo:Workout| null = getWorkout(date,plan);
    
    if(appo){
        workoutData = appo;
    }

    // onMount(()=>{
    //     fetchSchede(stato.uid);
    //     fetchEsercizi(stato.uid);
    //     fetchWorkouts(stato.uid);

    //     loading = flags.fetchE&&flags.fetchW&&flags.fetchS;
    // })

    $effect(()=>{
        fetchSchede(stato.uid);
        fetchEsercizi(stato.uid);
        fetchWorkouts(stato.uid);

        loading = !(flags.fetchE&&flags.fetchW&&flags.fetchS);
    })

    function close(){
        delWorkout(workoutData);
        deleted = true;
    }
</script>

<style>
    .box{
        display: block;
        box-sizing: border-box;
        width: 100%;
        height : 100%;
        scrollbar-width: none;
        overflow: auto;
    }
    .grid{
        display:grid;
        grid-template-columns: 95% 5%;
        grid-template-rows: 5% 95%;
        width: 100%;
        height : 100%;
    }
    .text{
        font-family: Arial, Helvetica, sans-serif;
    }
    .exit-button{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        margin: 0px;
        padding: 0%;
        background-color: #ffff;
        box-sizing: border-box;
        cursor: pointer;
        display: grid;
        place-items: center;
    }
    .exit-button:hover{
        background-color: #d8ebe0;
    }
    .center{
        align-items: center; 
    }
</style>

<div class="box">


    {#if loading}
        <Loading></Loading>
    {:else}
        {#if deleted}
            <h3 class="text">Allenamento cancellato!</h3>
        {:else}
            <div class="grid">
                <p class="text">{"Allenamento: "+plan+" del "+date}</p>
                <div class="exit-button" onclick={close} onkeyup={close} role="button" tabindex= 0>
                    <img class="center" src="/DefaultPics/icons8-bin-24.png" alt="">
                </div>
                <p class="text">da fare visualizzazione allenamento</p>
            </div>
        {/if}
    {/if}
</div>