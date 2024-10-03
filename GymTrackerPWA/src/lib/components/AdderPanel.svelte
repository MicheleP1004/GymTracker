<script lang="ts">
    import type {set,exSets} from '../../data.svelte';
    import {fetchEsercizi, fetchSchede, Scheda, Workout} from '../../data.svelte';
    import {setWorkout,fetchWorkouts,getType,existWorkout} from '../../data.svelte';
    import {schede} from '../../data.svelte';

    import { stato } from '../../globalState.svelte';
	import Loading from './Loading.svelte';
    import {flags} from "../../data.svelte";

    let loading:boolean=$state(true);

    let scheda:Scheda = $state(new Scheda(stato.uid,'','',[]));
    let types:string[] = []; 

    let data:Date|null = $state(null);
    let plan: string = $state('');
    let sets: exSets[] = [];

    $effect(()=>{
        fetchSchede(stato.uid);
        fetchEsercizi(stato.uid);
        fetchWorkouts(stato.uid);

        loading = !(flags.fetchE&&flags.fetchW&&flags.fetchS);
    })

    function initializeTypes():void{
        types = [];
        for(let i=0;i<scheda.esercizi.length;i++){
            let type:string = getType(scheda.esercizi[i].ides);
            if(type){
                types.push(type);
                sets[i] = { ex: [] };
                if(type == "strength"){
                    sets[i].ex = Array(scheda.esercizi[i].serie).fill(0).map(() => ({
                        reps: 0,
                        peso: 0
                    }));
                }
                if(type == "cardio"){
                    let set:set = { durata: 0, distanza: 0 };
                    sets[i].ex = [set];
                }
                if(type == "flex"){
                    let set:set = { durata: 0 }
                    sets[i].ex = [set];
                }
            }
        }
    }

    function reset():void{
        scheda = new Scheda(stato.uid,'','',[]);
        types = [];
        data = null;
        plan = '';
        sets = [];
    }

    function apply():void{
        let s:string;

        if(scheda.name == ''){
            alert("Selezionare una scheda");
            return;
        }

        if(!data){
            data = new Date();
            s=data.toISOString().substring(0, 10);
        }else{
            s = data.toString();
        }

        if(existWorkout(s,scheda.name)){
            alert("Un allenamento di questa scheda è già stato registrato in questa data");
            data=null;
            return;
        }


        let w: Workout = new Workout(stato.uid,s,scheda.name,sets);
        console.log(w.date);

        setWorkout(w);

        reset();
    }
</script>

<style>
    .form{
        box-sizing: border-box;
        width: 100%;
        height : 100%;
        scrollbar-width: none;
        overflow: auto;
    }
    .button {
        border-radius: 12px;
        background-color: white;
        border-width: 0px;
        padding: 20px 40px; 
        width: 31%; 
        font-size: 1.1em; 
        display: flex; 
        align-self: center; 
        justify-content: center;
        cursor: pointer;
    }
    .button:hover {
        background-color: rgb(238, 238, 238);
    }
    .text {
        margin-left: 0%; 
        font-style: normal;
        font-family: Arial, Helvetica, sans-serif;
        align-items: center;
    }
    .inner-grid{
        display:grid;
        grid-template-columns: 33% 33% 33%;
        place-items: center;
    }
    .left{
        position: relative;
        padding: 5%;
        text-align: left;
        font-family: Arial, Helvetica, sans-serif;
    }
</style>

<div class="form">
    {#if loading}
        <Loading></Loading>
    {:else}
        {#if (schede.length != 0)}
            <form class="left">
                <label for="data">Inserisci data allenamento:</label>
                <input type="date" id="data" bind:value={data}><br><br>

                <label for="data">Seleziona scheda:</label>
                <select  bind:value={scheda} id="selection" name="selection">
                    {#each schede as s}
                        <option value={s}>{s.name}</option>
                    {/each}
                </select><br><br>

                {initializeTypes()}

                {#each scheda.esercizi as es,index}
                    <p class="text">{es.ides}</p>
                    
                    {#if (types[index]== "strength")}
                        {#each Array(es.serie).fill(0) as _,i}
                            <p class="text">{"Serie"+(i+1)}</p>
                            <label for="reps">Ripetizioni:</label>
                            <input type="number" id="reps" bind:value={sets[index].ex[i].reps} min=0/><br>
                            <label for="peso">Peso in kg:</label>
                            <input type="number" id="peso" bind:value={sets[index].ex[i].peso} min=0/><br>
                        {/each}
                    {/if}
                    
                    {#if (types[index]== "flex")}
                        <label for="durata">Durata:</label>
                        <input 
                            id="durata"
                            type="number" 
                            min=0
                            bind:value={sets[index].ex[0].durata}
                        />
                    {/if}

                    {#if (types[index]== "cardio")}
                        <label for="durata">Durata:</label>
                        <input 
                            id="durata"
                            type="number" 
                            min=0
                            bind:value={sets[index].ex[0].durata}
                        /><br><br>
                        <label for="distanza">Distanza:</label>
                        <input 
                            id="distanza"
                            type="number" 
                            min=0
                            bind:value={sets[index].ex[0].distanza}
                        />
                    {/if}
                {/each}

            </form>

            <div class="inner-grid">
                <button class="button" onclick={reset}>Reset</button>
                <p class="text">Attenzione! Se confermi senza inserire alcuni campi verranno autamaticamente salvati con 0</p>
                <button class="button" onclick={apply}>Conferma</button>
            </div>
        {:else}
            <p class="text">Non sono presenti schede, prima di aggiungere un allenamento registra una scheda</p>
        {/if}
    {/if}
</div>