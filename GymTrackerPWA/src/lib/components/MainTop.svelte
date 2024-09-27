<script lang="ts">
    import ProfileInfo from "./ProfileInfo.svelte";

    // import {stato} from "../../globalState.svelte";
    import * as stato from '../../globalState.svelte';

    let utente = stato.getUtente();

    let img:string = '/DefaultPics/ProfilePicture.jpg';

    let cardioImg:string = '/DefaultPics/icons8-cardio-50.png';
    let strengthImg:string = '/DefaultPics/icons8-strength-50 (1).png';
    let flexibilityImg:string = '/DefaultPics/icons8-stretching-hamstring-50.png';
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
  .icon{
    border-radius: 50%;
    background-color: #ffffff;
    align-self: center;
  }
</style>

<!-- <h1>{stato.utente.email}</h1> -->
<div class="main-top">
    <ProfileInfo propic={img} userName={utente.username} bio={utente.bio}></ProfileInfo>
    <div class="icons-section">
      <div class="icon-border">
        <img class="icon" src={cardioImg} alt="">
      </div>
      <div class="icon-border">
        <img class="icon" src={strengthImg} alt="">
      </div>
      <div class="icon-border">
        <img class="icon" src={flexibilityImg} alt="">
      </div>
    </div>
</div>
