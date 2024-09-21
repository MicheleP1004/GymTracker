<script lang="ts">
    import Adder from "./Adder.svelte";
    const plusImg:string ="/DefaultPics/icons8-plus-50.png";

    let adderVisibility:boolean = $state(false);

    function triggerAdder(){
        adderVisibility = !adderVisibility;
    }

    function handleClosure(){
        adderVisibility = false;
    }
</script>

<style>
    .button{
        display: grid;
        border-radius: 12px;
        height: 100%;
        width: 50%;
        background-color: #4fc080;
        place-items: center;
        cursor: pointer;
    }
    .center{
        align-items: center;
    }
    .button:hover{
        background-color: #47a871;
    }
</style>

<div class="button" onclick={triggerAdder} onkeyup={triggerAdder} role="button" tabindex="0">
    <img class="center" src={plusImg} alt="">
</div>

{#if (adderVisibility)}
    <Adder visibility={adderVisibility} on:adder-closed={handleClosure}></Adder>
{/if}