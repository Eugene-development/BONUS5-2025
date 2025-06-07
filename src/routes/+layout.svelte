<script>
	import '../app.css';
	import { Menu } from './layout/header/UI';
	import { Component } from './layout/footer/UI';
	import { auth } from '$lib/state/auth.svelte.js';
	import { onMount } from 'svelte';

	/** @type {import('./$types').LayoutProps} */
	let { data, children } = $props();

	// Синхронизируем server-side данные с client-side store при загрузке и изменениях
	function syncAuthData() {
		if (data.isAuthenticated && data.user) {
			console.log('🔄 Syncing server data to client state:', data.user);
			auth.user = {
				id: data.user.id || 1,
				name: data.user.name || data.user.email,
				email: data.user.email
			};
			auth.isAuthenticated = true;
		} else {
			auth.user = null;
			auth.isAuthenticated = false;
		}
		auth.loading = false;
		auth.error = null;
	}

	onMount(() => {
		syncAuthData();
	});

	// Реактивно синхронизируем данные при изменениях
	$effect(() => {
		if (data.isAuthenticated !== undefined) {
			syncAuthData();
		}
	});
</script>

<header class="bg-gray-900">
	<Menu />
</header>

{@render children()}

<footer class="border-t border-gray-100 bg-gray-900 py-6">
	<Component />
</footer>
