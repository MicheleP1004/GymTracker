<script lang="ts">
    import ProfileInfo from "./ProfileInfo.svelte";

    let img:string = '/DefaultPics/ProfilePicture.jpg';
</script>

<style>
  .main-top{
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
    box-sizing: border-box;
  }
</style>

<div class="main-top">
    <ProfileInfo propic={img}></ProfileInfo>
</div>
