<script lang="ts">
    let {propic}: {propic:string} = $props();
</script>

<style>
    .profile-box{
        display: flex;
        height: 100%;
        width: 100%;
        /* grid-template-columns: 10% 90%;
        grid-template-rows: 10% 90%; */
        border-radius: 12px;
        background-color: #eeeeee;
        padding: 1%;
    }
    .pro-pic {
      height: 42%;
      width: 12%;
      border-radius: 50%;
      object-fit: cover;
    }
    .text{
        margin-left: 2%; 
        font-style: normal;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 500;
    }
</style>

<div class="profile-box">
    <img class="pro-pic" src={propic} alt="">
    <h1 class="text">Utente</h1>
</div>
