<script lang="ts">
    import {Esercizio,Scheda} from '../../data.svelte';
    import {esercizi,schede} from '../../data.svelte';
    import {fetchEsercizi,fetchSchede} from '../../data.svelte'

    import {setScheda,setEsercizio,delScheda,delEsercizio} from '../../data.svelte';
    import { stato } from '../../globalState.svelte';
	import Loading from './Loading.svelte';
	import { onMount } from 'svelte';
    import type {tipo} from '../../data.svelte';
    import {flags} from "../../data.svelte";

    //flag
    let loading:boolean = $state(true);
    let makeEs:boolean = $state(false);
    let makePlan:boolean = $state(false);
    let delEs:boolean = $state(false);
    let delPlan:boolean = $state(false);

    //variabili di appoggio
    let selezionatiE:Esercizio[] = $state([]);
    let selezionatiS:Scheda[] = $state([]);
    
    let nomeEs:string = $state('');
    let descrizione:string = $state('');
    let tipologia:tipo = $state(null);

    let nomeScheda:string = $state('');
    let descrizioneScheda:string = $state('');
    let eserciziScheda:{ides:string,serie?:number}[] = $state([{ides:''}]);
    let exs:Esercizio[] = $state([new Esercizio(stato.uid,'','',null)]);



    $effect(()=>{
        fetchSchede(stato.uid);
        fetchEsercizi(stato.uid);

        loading = !(flags.fetchE&&flags.fetchS);
    })

    function resetMakePlan():void{
        exs = [new Esercizio(stato.uid,'','',null)];
        makePlan = false;
    }
    function resetDelPlan():void{
        delPlan = false;
    }
    function resetMakeEs():void{
        nomeEs='';
        descrizione='';
        tipologia=null;
        makeEs = false;
    }
    function resetDelEs():void{
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

        if(contains(esercizi,nomeEs)){
            alert("Un esercizio con lo stesso nome esiste già.");
            return;
        }

        //modifica dati
        setEsercizio(new Esercizio(stato.uid,nomeEs,descrizione,tipologia));

        resetMakeEs();
    }

    function applyMakePlan():void{
        if (nomeScheda == '') {
            alert("Il campo 'Nome' è obbligatorio.");
            return;
        }

        if (eserciziScheda?.length == 0) {
            alert("Selezionare un esercizio");
            return;
        }

        if(contains(schede,nomeScheda)){
            alert("Una scheda con lo stesso nome esiste già.");
            return;
        }
        for(let i=0;i<exs.length;i++){
            eserciziScheda[i].ides = exs[i].name;
        }

        for (let i = exs.length - 1; i >= 0; i--) {
            if (eserciziScheda[i].ides === '') {
                removeExercise(i);
            }
        }

        //modifica dati
        setScheda(new Scheda(stato.uid,nomeScheda,descrizioneScheda,eserciziScheda));

        nomeScheda='';
        descrizioneScheda='';
        eserciziScheda = [{ides:''}];
        exs=[new Esercizio(stato.uid,'','',null)];
        makePlan = false;
    }

    function contains(list:Esercizio[]|Scheda[],nome:string): boolean {
        return list.some((item) => item.name === nome);
    }

    function toggleSelezioneE(e:Esercizio){
        if(selezionatiE.includes(e)){
            selezionatiE = selezionatiE.filter(el => el !== e);
        }else{
            selezionatiE.push(e);
        }
    }

    function toggleSelezioneS(s:Scheda){
        if(selezionatiS.includes(s)){
            selezionatiS = selezionatiS.filter(el => el !== s);
        }else{
            selezionatiS.push(s);
        }
    }

    function applyDelEs(){
        //modifica dati
        for(let e of selezionatiE)
            delEsercizio(e);

        delEs=false;
        selezionatiE=[];
    }

    function applyDelPlan(){
        //modifica dati
        for(let s of selezionatiS)
            delScheda(s);

        delPlan=false;
        selezionatiS=[];
    }

    function removeExercise(index:number):void{
        exs.splice(index, 1);
        eserciziScheda.splice(index, 1);
    }
</script>

<style>
    .form{
        box-sizing: border-box;
        place-items: center;
        width: 100%;
        height : 100%;
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

                    <form class="left">
                        <label for="name">Nome:</label><br>
                        <input type="text" id="name" name="name" required bind:value={nomeScheda}><br><br>

                        <label for="descrizione">Descrizione:</label><br>
                        <input type="text" id="descrizione" name="descrizione" bind:value={descrizioneScheda}><br><br>
                        {#each exs as e,index}
                            <label for="selection">Scegli l'esercizio:</label>

                            <select bind:value={exs[index]} id="selection" name="selection">
                                {#each esercizi as es}
                                    <option value={es}>{es.name}</option>
                                {/each}
                            </select><br><br>
                            
                            {#if (e.tipo=="strength")}
                                {(() => { eserciziScheda[index] = { ides: '', serie: 1 }; })()}
                                <label for="numberInput">Inserisci il numero di serie:</label>
                                <input type="number" id="numberInput" bind:value={eserciziScheda[index].serie} min=1/><br>
                            {/if}

                            <button type="button" onclick={() => removeExercise(index)}>Rimuovi esercizio</button><br><br>
                        {/each}
                    </form>

                    <div class="inner-grid">
                        <button class="button" onclick={resetMakePlan}>Annulla</button>
                        <button class="button" onclick={()=>{
                            exs.push(new Esercizio(stato.uid,'','',null));
                            eserciziScheda.push({ides:''});
                            }}>Aggiungi esercizio</button>
                        <button class="button" onclick={applyMakePlan}>Conferma</button>
                    </div>
                {:else}
                    {#if schede.length == 0}
                        <p class="text">Non hai schede registrate</p>
                    {:else}
                    <form class="left">
                        {#each schede as s}
                        <label>
                            <input 
                            type="checkbox" 
                            onchange={() => toggleSelezioneS(s)}>
                            {s.name}
                        </label><br>
                        {/each}
                    </form>
                    {/if}
                    <div class="inner-grid">
                        <button class="button" onclick={resetDelPlan}>Annulla</button>
                        <p></p>
                        <button class="button" onclick={applyDelPlan}>Conferma</button>
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
                    {#if esercizi.length == 0}
                        <p class="text">Non hai esercizi registrati</p>
                    {:else}
                    <form class="left">
                        {#each esercizi as e}
                        <label>
                            <input 
                              type="checkbox" 
                              onchange={() => toggleSelezioneE(e)}>
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
