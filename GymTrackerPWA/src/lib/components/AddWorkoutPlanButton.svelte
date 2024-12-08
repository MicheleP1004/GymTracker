<script lang="ts">
    import Modal from "./Modal.svelte";
    import PlannerPanel from "./PlannerPanel.svelte";

    const addPlanImg:string ="/DefaultPics/icons8-writing-50.png";

    let plannerVisibility:boolean = $state(false);

    function triggerPlanner(){
        plannerVisibility = !plannerVisibility;
    }

    function handleClosure(){
        plannerVisibility = false;
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

<div class="button" onclick={triggerPlanner} onkeyup={triggerPlanner} role="button" tabindex="0">
    <img class="center" src={addPlanImg} alt="">
</div>

{#if plannerVisibility}
    <Modal visibility={plannerVisibility} component={PlannerPanel} props={{}} on:modal-closed={handleClosure}></Modal>
{/if}