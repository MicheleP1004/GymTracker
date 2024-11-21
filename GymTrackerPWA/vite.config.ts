import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	plugins: [
		sveltekit(),
		// SvelteKitPWA({

		// })
		// VitePWA({
		// 	registerType: 'autoUpdate',
		// 	manifest: {
		// 		name: 'SAW GymTracker PWA',
		// 		short_name: 'GymTracker',
		// 		description: 'App di tracciamento allenamneti realizzata con svelte 5 e firebase',
		// 		start_url: '/',
		// 		display: 'standalone',
		// 		background_color: '#0000',
		// 		theme_color: '#42b883',
		// 		icons: [
		// 			{
		// 				src: 'icons/icon-192x192.png',
		// 				sizes: '192x192',
		// 				type: 'image/png'
		// 			},
		// 			{
		// 				src: 'icons/icon-512x512.png',
		// 				sizes: '512x512',
		// 				type: 'image/png'
		// 			}
		// 		]
		// 	},
		// 	workbox: {
        //         globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,gif}'],
        //         runtimeCaching: [
        //             {
        //                 urlPattern: ({ request }) => request.destination === 'document',
        //                 handler: 'NetworkFirst',
        //                 options: {
        //                     cacheName: 'html-cache',
        //                     expiration: {
        //                         maxEntries: 10,
        //                         maxAgeSeconds: 3600
        //                     }
        //                 }
        //             }
        //         ]
        //     }
		// })
	]
});
