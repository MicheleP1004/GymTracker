<script lang="ts">
    const addPlanImg:string ="/DefaultPics/icons8-writing-50.png";
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

<div class="button">
    <img class="center" src={addPlanImg} alt="">
</div>