<script  lang="ts">
	import type { Friend } from "../../globalState.svelte";

  let {f}: {f:Friend} = $props();
</script>

<style>
    
</style>
  
  <h1>{f.username}</h1>