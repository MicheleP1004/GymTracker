<script lang="ts">
    import Modal from "./Modal.svelte";

    const img:string ="/DefaultPics/icons8-writing-50.png";

    let modalVisibility:boolean = $state(false);

    function triggerModal(){
        modalVisibility = !modalVisibility;
    }

    function handleClosure(){
        modalVisibility = false;
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

<div class="button" onclick={triggerModal} onkeyup={triggerModal} role="button" tabindex="0">
    <img class="center" src={img} alt="">
</div>

{#if modalVisibility}
    <Modal visibility={modalVisibility} on:modal-closed={handleClosure}></Modal>
{/if}