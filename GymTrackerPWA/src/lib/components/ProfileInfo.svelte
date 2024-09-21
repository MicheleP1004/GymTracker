<script lang="ts">
    let {propic,userName}: {propic:string,userName:string} = $props();
</script>

<style>
    .profile-box{
        display: grid;
        height: 100%;
        width: 100%;
        /* grid-template-columns: 20% 80%; */
        grid-template-rows: 50% 50%;
        border-radius: 12px;
        background-color: #eeeeee;
        padding: 1%;
        box-sizing: border-box;
    }
    .user-box{
        display: grid;
        height: 100%;
        width: 100%;
        grid-template-columns: 20% 80%;
        box-sizing: border-box;
        align-items: center;
        /* place-items: center; */
    }
    .centering{
        display: grid;
        place-items: center;
    }
    .pro-pic {
        height: 90px;
        width: 90px;
        border-radius: 50%;
        object-fit: cover;
        align-items: center;
    }
    .text{
        margin-left: 2%; 
        font-style: normal;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 500;
        max-width: 100%;
        overflow-y: auto;
        scrollbar-width: none;
    }
</style>

<div class="profile-box">
    <div class="user-box">
        <div class="centering">
            <img class="pro-pic" src={propic} alt="">
        </div>
        <h2 class="text">{userName}</h2>
    </div>
    <p class="text">Esempio di bio ciaociaociaociaociao</p>
</div>
