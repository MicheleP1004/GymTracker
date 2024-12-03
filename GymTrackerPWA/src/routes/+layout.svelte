<script lang="ts">
    import { onMount } from 'svelte';

    onMount(async () => {
        if ('serviceWorker' in navigator) {
            try {
                // Registra anche il service worker per Firebase Messaging
                const firebaseMessagingRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                console.log('Service Worker per Firebase Messaging registrato con successo:', firebaseMessagingRegistration);

                // Registra il service worker principale
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker principale registrato con successo:', registration);

            } catch (error) {
                console.error('Errore durante la registrazione dei service worker:', error);
            }
        }
    });
</script>

<slot />
