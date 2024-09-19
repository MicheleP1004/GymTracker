<script lang="ts">
    import MainTop from "./MainTop.svelte";
import ProfileInfo from "./ProfileInfo.svelte";

    let img:string = '/DefaultPics/ProfilePicture.jpg';
</script>

<style>
  .main-content {
    display: grid;
    /* grid-template-columns: 1fr 1fr; */
    grid-template-rows: 20% 60% 20%;
    background-color: #ffffff;
    padding: 0.5%;
    overflow-y: auto;
    scrollbar-width: none;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  .main-body{
    display: grid;
    grid-template-columns: 50% 50%;
  }
</style>

<div class="main-content">
    <MainTop></MainTop>
    <div class="main-body"></div>
</div>
