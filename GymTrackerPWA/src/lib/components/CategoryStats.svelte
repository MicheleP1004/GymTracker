<script lang="ts">
    import { stato } from "../../globalState.svelte";
    import {
        allenamenti,
        Esercizio,
        fetchEsercizi,
        fetchSchede,
        fetchWorkouts,
        flags,
        getEsercizi,
        getScheda,
        Scheda,
        Workout
    } from "../../data.svelte";
    import Loading from "./Loading.svelte";
    import Chart from 'chart.js/auto';
    import { onDestroy } from 'svelte';

    let { tipo }: { tipo: string } = $props();

    console.log(tipo);

    let loading: boolean = $state(true);
    let initialized: boolean = $state(false);

    let weeksStrength: number[] = new Array(12).fill(0);
    let weeksFlex: number[] = new Array(12).fill(0);
    let weeksCardio: number[] = new Array(12).fill(0);

    // Riferimento al canvas
    // svelte-ignore non_reactive_update
        let chartCanvas: HTMLCanvasElement | null = null;

    // Istanze del grafico
    let chartInstance: Chart | null = null;

    $effect(() => {
        fetchEsercizi(stato.uid);
        fetchSchede(stato.uid);
        fetchWorkouts(stato.uid);

        if (flags.fetchE && flags.fetchW && flags.fetchS) {
            initialize();
        }

        if (initialized && chartCanvas) {
            createChart();  // Creo il grafico solo dopo che il canvas è disponibile
            console.log(weeksCardio,weeksFlex,weeksStrength);
        }

        loading = !(flags.fetchE && flags.fetchW && flags.fetchS);
    });

    // Distruzione del grafico al dismount del componente
    onDestroy(() => {
        if (chartInstance) {
            chartInstance.destroy();
        }
    });

    function initialize() {
        if (initialized) return;

        let array = allenamenti;
        array.sort((a:Workout,b:Workout)=>{
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            return dateB.getTime() - dateA.getTime();
        });

        for (let a of array) {
            let scheda: Scheda | null = getScheda(a.plan);
            if (scheda) {
                let names: string[] = [];
                for (let es of scheda.esercizi)
                    names.push(es.ides);

                let es: (Esercizio | null)[] = getEsercizi(names);
                let i: number = 0;
                for (let e of es) {
                    if (e) registerData(e, scheda, i, a);
                    i++;
                }
            }
        }
        initialized = true;
    }

    function registerData(esercizio: Esercizio, scheda: Scheda, index: number, workout: Workout) {
        let now: Date = new Date();
        let week = weeksAgo(workout.date, now);

        if (week < 0) return;

        if (tipo == "strength" && esercizio.tipo == "strength") {
            for (let i = 0; i < scheda.esercizi[index].serie!; i++) {
                weeksStrength[week] += workout.sets[index].ex[i].peso! * workout.sets[index].ex[i].reps!;
            }
        }

        if (tipo == "flex" && esercizio.tipo == "flex") {
            weeksFlex[week] += workout.sets[index].ex[0].durata!;
        }

        if (tipo == "cardio" && esercizio.tipo == "cardio") {
            weeksCardio[week] += workout.sets[index].ex[0].durata!;
        }
    }

    function weeksAgo(eventDateStr: string, today: Date): number {
        const eventDate = new Date(eventDateStr);
        const msPerDay = 24 * 60 * 60 * 1000;
        const msDifference = today.getTime() - eventDate.getTime();
        const currentWeek = Math.floor((today.getTime() + msPerDay * (today.getDay() ? today.getDay() - 1 : 6)) / (msPerDay * 7));
        const eventWeek = Math.floor((eventDate.getTime() + msPerDay * (eventDate.getDay() ? eventDate.getDay() - 1 : 6)) / (msPerDay * 7));
        const weekDifference = currentWeek - eventWeek;

        if (weekDifference < 1 || weekDifference > 12) {
            return -1;
        }

        return weekDifference - 1;
    }

    // Crea il grafico
    function createChart() {

        if (!chartCanvas) {
            console.error('Canvas non trovato!');
            return;
        }

        const ctx = chartCanvas.getContext('2d');
        if (!ctx) {
            console.error('Impossibile ottenere il contesto del canvas!');
            return;
        }

        // Distruggi il grafico precedente, se esiste
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Configurazione dei dati e opzioni
        const data = {
            labels: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`).reverse(),
            datasets: [
                {
                    label: tipo === 'strength' ? 'Strength (kg)' : tipo === 'flex' ? 'Flexibility (minutes)' : 'Cardio (minutes)',
                    data: tipo === 'strength' ? weeksStrength.reverse() : tipo === 'flex' ? weeksFlex.reverse() : weeksCardio.reverse(),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        // Creazione del grafico
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data,
            options
        });
    }
</script>

<style>
    .grid {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        scrollbar-width: none;
        overflow: auto;
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 10% 90%;
    }

    canvas {
        max-width: 100%;
        max-height: 100%;
    }
</style>

{#if loading}
    <Loading></Loading>
{:else}
    <div class="grid">
        <p>Gli allenamenti della settimana attuale non verranno conteggiati</p>
        <canvas bind:this={chartCanvas}></canvas>
    </div>
{/if}
