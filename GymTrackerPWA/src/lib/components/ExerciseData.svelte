<script lang="ts">
	import type { set } from "../../data.svelte";
    let {sets,index,ex,type}: {sets:set[],index:number,ex:{ides:string,serie?:number},type:string} = $props();
</script>

<style>
    .box{
        display: block;
        box-sizing: border-box;
        width: 100%;
        text-align: left;
    }
    .text{
        font-family: Arial, Helvetica, sans-serif;
    }
</style>

<div class="box">
    <h4 class="text">{"Esercizio "+(index+1)+" : "+ex.ides}</h4>
    {#each sets as s,i}
        {#if type == "strength"}
            <p class="text">Tipo : Forza</p>
            <p class="text">{"Serie "+(i+1)+" : \nRipetizioni : "+s.reps+"\nPeso : "+s.peso+"kg"}</p>
        {/if}
        {#if type == "flex"}
            <p class="text">Tipo : Flessibilità</p>
            <p class="text">{"Duarata : "+s.durata+" minuti"}</p>
        {/if}
        {#if type == "cardio"}
            <p class="text">Tipo : Cardio</p>
            <p class="text">{"Duarata : "+s.durata+" minuti\nDistanza : "+s.distanza}</p>
        {/if}
    {/each}
</div>
