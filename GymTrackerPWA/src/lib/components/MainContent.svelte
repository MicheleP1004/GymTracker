<script lang="ts">
    import MainTop from "./MainTop.svelte";
    import WorkoutList from "./WorkoutList.svelte";
    import AddWorkoutButton from "./AddWorkoutButton.svelte";
	  import AddWorkoutPlanButton from "./AddWorkoutPlanButton.svelte";
</script>

<style>
  .main-content {
    display: grid;
    /* grid-template-columns: 1fr 1fr; */
    grid-template-rows: 25% 65%;
    background-color: #ffffff;
    padding: 0.5%;
    overflow-y: auto;
    scrollbar-width: none;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  .main-body{
    place-items: center;
    display: grid;
    grid-template-rows: 50% 50%;
  }
  .main-body-upper{
    height: 100%;
    width: 100%;
    place-items: center;
    display: grid;
    grid-template-columns: 50% 50%;
    padding :4%;
    box-sizing: border-box;
  }
</style>

<div class="main-content">
    <MainTop></MainTop>
    <div class="main-body">
      <div class="main-body-upper">
        <!-- <h1>bottone allenamento</h1> -->
         <AddWorkoutButton></AddWorkoutButton>
        <!-- <h1>bottone piano</h1> -->
         <AddWorkoutPlanButton></AddWorkoutPlanButton>
      </div>
      <WorkoutList></WorkoutList>
    </div>
</div>
