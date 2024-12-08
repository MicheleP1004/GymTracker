<script lang="ts">
    import ProfileInfo from "./ProfileInfo.svelte";

    import {stato} from "../../globalState.svelte";
    
    let cardioImg:string = '/DefaultPics/icons8-cardio-50.png';
    let strengthImg:string = '/DefaultPics/icons8-strength-50 (1).png';
    let flexibilityImg:string = '/DefaultPics/icons8-stretching-hamstring-50.png';

    let tipo:string = $state('');

	import Modal from "./Modal.svelte";
  import CategoryStats from "./CategoryStats.svelte";

    let modalVisibility:boolean = $state(false);

    function triggerModal(s:string):undefined{
      tipo=s;
      modalVisibility = !modalVisibility;
    }

    function handleClosure(){
      tipo = '';
      modalVisibility = false;
    }

</script>

<style>
  .main-top{
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
    box-sizing: border-box;
  }
  .icons-section{
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 33% 33% 33%;
    box-sizing: border-box;
    place-items: center;
  }
  .icon-border{
    display: grid;
    height: 60px;
    width: 60px;
    border-radius: 50%;
    background-color: #4fc080;
    place-items: center;
  }

  .button{
    border-radius: 50%;
    background-color: #ffffff;
    align-self: center;
    display: grid;
    place-items: center;
    cursor: pointer;
  }
  .center{
      align-items: center;
  }
  .button:hover{
      background-color: #b6b6b6;
  }
</style>

<div class="main-top">
  <ProfileInfo propic={stato.propic} userName={stato.username} bio={stato.bio}></ProfileInfo> 
  <div class="icons-section">
    <div class="icon-border">
      <div class="button" onclick={()=>triggerModal("cardio")} onkeyup={()=>triggerModal("cardio")} role="button" tabindex="0">
        <img class="center" src={cardioImg} alt="">
      </div>
    </div>
    <div class="icon-border">
      <div class="button" onclick={()=>triggerModal("strength")} onkeyup={()=>triggerModal("strength")} role="button" tabindex="0">
        <img class="center" src={strengthImg} alt="">
      </div>
    </div>
    <div class="icon-border">
      <div class="button" onclick={()=>triggerModal("flex")} onkeyup={()=>triggerModal("flex")} role="button" tabindex="0">
        <img class="center" src={flexibilityImg} alt="">
      </div>
    </div>
  </div>
</div>

{#if modalVisibility}
    <Modal visibility={modalVisibility} component={CategoryStats} props={{tipo}} on:modal-closed={handleClosure}></Modal>
{/if}
