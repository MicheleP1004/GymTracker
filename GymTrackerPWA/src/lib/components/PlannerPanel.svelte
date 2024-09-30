<script lang="ts">
    import {Esercizio} from '../../globalState.svelte';
    import { stato } from '../../globalState.svelte';
    import {getExcercises} from '../../firestore';
	import Loading from './Loading.svelte';
	import { onMount } from 'svelte';
    import type {tipo} from '../../globalState.svelte';

    let esercizi:Esercizio[] | null = $state([]);

    //flag
    let loading:boolean = $state(true);
    let makeEs:boolean = $state(false);
    let makePlan:boolean = $state(false);
    let delEs:boolean = $state(false);
    let delPlan:boolean = $state(false);

    //contatori


    //variabili di appoggio
    let exs:Esercizio[] = $state([new Esercizio(stato.uid,'','','strength')]);
    let selezionati:Esercizio[] = $state([]);
    
   

    let nomeEs:string = $state('');
    let descrizione:string = $state('');
    let tipologia:tipo = $state(null);


    onMount(()=>{
        fetchEsercizi();
        // console.log(esercizi![0]);
        loading= false;
    })

    async function fetchEsercizi():Promise<void> {
        try{
            let es:Esercizio[]|null = await getExcercises(stato.uid);
            if(!es){
                esercizi = [];
            }else{
                esercizi=es;
            }
        }catch(e){
            console.log(e);
        }
    }

    function resetMakePlan():void{
        exs = [new Esercizio(stato.uid,'','',null)];
        makePlan = false;
    }
    function resetDelPlan():void{
        // exs = [new Esercizio('',stato.uid,'','','strength')];
        delPlan = false;
    }
    function resetMakeEs():void{
        // exs = [new Esercizio('',stato.uid,'','','strength')];
        nomeEs='';
        descrizione='';
        tipologia=null;
        makeEs = false;
    }
    function resetDelEs():void{
        // exs = [new Esercizio('',stato.uid,'','','strength')];
        delEs = false;
    }

    function applyMakeEs():void{
        if (nomeEs == '') {
            alert("Il campo 'Nome' è obbligatorio.");
            return;
        }

        if (!tipologia) {
            alert("Seleziona una 'Tipologia'.");
            return;
        }

        if(!esercizi){
            esercizi = [new Esercizio(stato.uid,nomeEs,descrizione,tipologia)];
        }else{
            esercizi.push(new Esercizio(stato.uid,nomeEs,descrizione,tipologia));
        }
        nomeEs='';
        descrizione='';
        tipologia=null;
        makeEs = false;
    }

    function toggleSelezione(e:Esercizio){
        if(selezionati.includes(e)){
            selezionati = selezionati.filter(el => el !== e);
        }else{
            selezionati.push(e);
        }
    }

    function applyDelEs(){
        esercizi = esercizi!.filter(item => !selezionati.includes(item));

        delEs=false;
        selezionati=[];
    }
</script>

<!-- svelte-ignore non_reactive_update -->
<style>
    .form{
        box-sizing: border-box;
        /* align-items: center; */
        place-items: center;
        width: 100%;
        grid-template-rows: 95% 5%;
    }
    .grid{
        scrollbar-width: none;
        overflow: auto;
        display: grid;
        grid-template-columns: 50% 50%;
        box-sizing: border-box;
        place-items: center;
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
    }
    .left{
        position: relative;
        left: 25%; 
        text-align: left;
        font-family: Arial, Helvetica, sans-serif;
    }
</style>

<div class="grid">
    {#if loading}
        <Loading></Loading>
    {:else}
        {#if makePlan || delPlan}
            <div class="form">
                {#if makePlan}
                    {#each exs as e}
                        <p>{e.owner}</p>
                    {/each}
                    <div class="inner-grid">
                        <button class="button" onclick={resetMakePlan}>Annulla</button>
                        <button class="button" onclick={()=>{exs.push(new Esercizio(stato.uid,'','',null))}}>Aggiungi esercizio</button>
                        <button class="button" onclick={resetMakePlan}>Conferma</button>
                    </div>
                {:else}
                    <p>cancellazione da fare</p>
                    <div class="inner-grid">
                        <button class="button" onclick={resetDelPlan}>Annulla</button>
                        <p></p>
                        <button class="button" onclick={resetDelPlan}>Conferma</button>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="grid">
                <button class="button" onclick={()=>{makePlan=true;}}>Crea scheda</button>
                <button class="button" onclick={()=>{delPlan=true;}}>Elimina scheda</button>
            </div>
        {/if}
        {#if makeEs || delEs}
            <div class="form">
                {#if makeEs}

                    <form class="left">
                        <label for="name">Nome:</label><br>
                        <input type="text" id="name" name="name" required bind:value={nomeEs}><br><br>

                        <label for="descrizione">Descrizione:</label><br>
                        <input type="text" id="descrizione" name="descrizione" bind:value={descrizione}><br><br>

                        <input type="radio" id="cardio" name="tipologia" value="cardio" bind:group={tipologia} required>
                        <label for="cardio">Cardio</label><br>
                        <input type="radio" id="strength" name="tipologia" value="strength" bind:group={tipologia} required>
                        <label for="strength">Forza</label><br>
                        <input type="radio" id="flex" name="tipologia" value="flex" bind:group={tipologia} required>
                        <label for="flex">Flessibilità</label><br>
                    </form>

                    <div class="inner-grid">
                        <button class="button" onclick={resetMakeEs}>Annulla</button>
                        <p></p>
                        <button class="button" onclick={applyMakeEs}>Conferma</button>
                    </div>
                {:else}
                    {#if esercizi!.length == 0}
                        <p class="text">Non hai esercizi registrati</p>
                    {:else}
                    <form class="left">
                        {#each esercizi! as e}
                        <label>
                            <input 
                              type="checkbox" 
                              onchange={() => toggleSelezione(e)}>
                            {e.name}
                          </label><br>
                        {/each}
                    </form>
                    {/if}

                    <div class="inner-grid">
                        <button class="button" onclick={resetDelEs}>Annulla</button>
                        <p></p>
                        <button class="button" onclick={applyDelEs}>Conferma</button>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="grid">
                <button class="button" onclick={()=>{makeEs=true;}}>Crea esercizio</button>
                <button class="button" onclick={()=>{delEs=true;}}>Elimina esercizio</button>
            </div>
        {/if}
    {/if}
</div>
