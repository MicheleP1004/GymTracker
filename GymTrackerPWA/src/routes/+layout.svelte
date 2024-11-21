<!-- <script lang="ts" type="module" src="sw.js">-->
<script lang="ts">
    import {onMount} from 'svelte';

    onMount(async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker registrato con successo:', registration);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
});
</script>

<slot />