<script lang="ts">
    import Loading from "./Loading.svelte";
    import {stato} from "../../globalState.svelte"
    import {fetchEsercizi, fetchSchede, fetchWorkouts, getWorkout, delWorkout,getEsercizi,getScheda, type Workout,type Scheda,type Esercizio} from "../../data.svelte";

    import {flags} from "../../data.svelte";
	import ExerciseData from "./ExerciseData.svelte";

    let {plan,date}: {plan:string,date:string} = $props();

    let loading: boolean = $state(true);
    let deleted:boolean = $state(false);
    let error:boolean = $state(false);

    let scheda:Scheda|null = null;
    let esercizi:(Esercizio|null)[] = [];

    let workoutData:Workout;

    $effect(()=>{
        fetchSchede(stato.uid);
        fetchEsercizi(stato.uid);
        fetchWorkouts(stato.uid);

        if((flags.fetchE&&flags.fetchW&&flags.fetchS)){
            initialize();
        }

        loading = !(flags.fetchE&&flags.fetchW&&flags.fetchS);
    })

    function close(){
        delWorkout(workoutData);
        deleted = true;
    }

    function initialize(){
        let appo:Workout| null = getWorkout(date,plan);
    
        if(appo){
            workoutData = appo;
        }

        scheda = getScheda(plan);
        if(scheda){
            let names: string[] = [];
            for(let es of scheda.esercizi)
                names.push(es.ides);
            esercizi = getEsercizi(names);
        }

        if(!scheda || esercizi.some((es)=>es === null)){
            error = true;
        }

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
    .box-data{
        display: block;
        box-sizing: border-box;
        width: 100%;
        height : 100%;
        scrollbar-width: none;
        overflow: auto;
        align-items: left;
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
    .bin-button{
        width: 80%;
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
    .bin-button:hover{
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
        {#if error}
            <h3 class="text">Allenamento cancellato</h3>
        {:else}
            {#if deleted}
                <h3 class="text">Allenamento cancellato</h3>
            {:else}
                <div class="grid">
                    <p class="text">{"Allenamento: "+plan+" del "+date}</p>
                    <div class="bin-button" onclick={close} onkeyup={close} role="button" tabindex= 0>
                        <img class="center" src="/DefaultPics/icons8-bin-24.png" alt="">
                    </div>
                    <div class="box-data">
                        <h3 class="text">{"Descrizione scheda: "+scheda?.descrizione}</h3>
                        {#each workoutData.sets as es,i}
                            <ExerciseData sets={es.ex} index={i} ex={scheda!.esercizi[i]} type={esercizi[i]!.tipo!}></ExerciseData>
                        {/each}
                    </div>
                </div>
            {/if}
        {/if}
    {/if}
</div>