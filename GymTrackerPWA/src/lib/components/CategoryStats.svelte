<script lang="ts">
    import {stato} from "../../globalState.svelte";
    import {allenamenti, Esercizio, fetchEsercizi,fetchSchede,fetchWorkouts, flags, getEsercizi, getScheda, Scheda, Workout} from "../../data.svelte";
	import Loading from "./Loading.svelte";
    
    let {type} : {type:string} = $props();

    let loading:boolean = $state(true);
    let initialized:boolean = $state(false);

    let weeksStrength:number[] = new Array(12).fill(0);;
    let weeksFlex:number[] = new Array(12).fill(0);;
    let weeksCardio:number[] = new Array(12).fill(0);;

    $effect(()=>{
        fetchEsercizi(stato.uid);
        fetchSchede(stato.uid);
        fetchWorkouts(stato.uid);

        if((flags.fetchE&&flags.fetchW&&flags.fetchS)){
            initialize();
        }
        loading = !(flags.fetchE&&flags.fetchW&&flags.fetchS);
    })

    function initialize(){
        if(initialized)return;
        for(let a of allenamenti){
            let scheda:Scheda|null = getScheda(a.plan);
            if(scheda){
                let names: string[] = [];
                for(let es of scheda.esercizi)
                    names.push(es.ides);

                let es:(Esercizio|null)[]=getEsercizi(names);
                let i:number=0;
                for(let e of es){
                    if(e)
                        registerData(e,scheda,i,a);
                    i++;
                }
            }
        }

        initialized=true;
    }

    function registerData(esercizio:Esercizio,scheda:Scheda,index:number,workout:Workout){
        let now:Date = new Date();
        let week = weeksAgo(workout.date,now);

        if(week<0)return;

        if(type=="strength" && esercizio.tipo == "strength"){
            for(let i=0;i < scheda.esercizi[index].serie!;i++){
                weeksStrength[week]+=workout.sets[index].ex[i].peso!*workout.sets[index].ex[i].reps!;
            }
        }

        if(type=="flex" && esercizio.tipo == "flex"){
            weeksFlex[week]+=workout.sets[index].ex[0].durata!;
        }

        if(type=="cardio" && esercizio.tipo == "cardio"){
            weeksCardio[week]+=workout.sets[index].ex[0].durata!;
        }
    }

    function weeksAgo(eventDateStr: string, today: Date): number {
        // Converti la stringa dell'evento in un oggetto Date
        const eventDate = new Date(eventDateStr);

        // Calcola la differenza in millisecondi tra oggi e la data dell'evento
        const msPerDay = 24 * 60 * 60 * 1000;
        const msDifference = today.getTime() - eventDate.getTime();

        // Calcola la differenza in giorni
        const dayDifference = Math.floor(msDifference / msPerDay);

        // Calcola la settimana di oggi e la settimana dell'evento
        const currentWeek = Math.floor((today.getTime() + msPerDay * (today.getDay() ? today.getDay() - 1 : 6)) / (msPerDay * 7));
        const eventWeek = Math.floor((eventDate.getTime() + msPerDay * (eventDate.getDay() ? eventDate.getDay() - 1 : 6)) / (msPerDay * 7));

        // Calcola la differenza in settimane
        const weekDifference = currentWeek - eventWeek;

        // Se l'evento è avvenuto questa settimana o prima di 12 settimane fa, ritorna -1
        if (weekDifference < 1 || weekDifference > 12) {
            return -1;
        }

        // Altrimenti, ritorna la differenza in settimane meno 1, per escludere la settimana corrente
        return weekDifference - 1;
    }
</script>

<style>
    .grid{
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        scrollbar-width: none;
        overflow: auto;
        display: grid;
        grid-template-columns: 40% 60%;
    }
</style>

{#if loading}
    <Loading></Loading>
{:else}
    <div class="grid">
        <p>grafico</p>
    </div>
{/if}