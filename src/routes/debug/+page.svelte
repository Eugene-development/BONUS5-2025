<script>
	import { auth } from '$lib/state/auth.svelte.js';
	import { page } from '$app/stores';

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	function getCookies() {
		if (typeof document !== 'undefined') {
			/** @type {Record<string, string>} */
			const cookies = {};
			document.cookie.split(';').forEach((cookie) => {
				const [name, value] = cookie.trim().split('=');
				if (name && value) {
					cookies[name] = value;
				}
			});
			return cookies;
		}
		return {};
	}

	let clientCookies = $derived(getCookies());

	async function testLogin() {
		console.log('🧪 Testing login API...');
		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: 'test@example.com',
					password: 'password',
					remember: false
				})
			});
			const data = await response.json();
			console.log('🧪 Login API test result:', { status: response.status, data });
			alert(`Login test: ${response.ok ? 'SUCCESS' : 'FAILED'}\nCheck console for details`);
		} catch (error) {
			console.error('🧪 Login API test error:', error);
			alert('Login test ERROR - check console');
		}
	}

	async function checkAuthState() {
		console.log('🔍 Current auth state:');
		console.log('Client Auth:', auth);
		console.log('Server Auth:', data);
		console.log('Client Cookies:', clientCookies);
		alert('Auth state logged to console');
	}
</script>

<div class="min-h-screen bg-gray-900 p-8 text-white">
	<h1 class="mb-8 text-3xl font-bold">Debug Authentication State</h1>

	<div class="grid gap-6">
		<!-- Client State -->
		<div class="rounded-lg bg-white/5 p-6">
			<h2 class="mb-4 text-xl font-semibold text-blue-400">Client Auth State</h2>
			<pre class="overflow-auto text-sm">{JSON.stringify(
					{
						isAuthenticated: auth.isAuthenticated,
						emailVerified: auth.emailVerified,
						loading: auth.loading,
						error: auth.error,
						user: auth.user
					},
					null,
					2
				)}</pre>
		</div>

		<!-- Server State -->
		<div class="rounded-lg bg-white/5 p-6">
			<h2 class="mb-4 text-xl font-semibold text-green-400">Server Auth State</h2>
			<pre class="overflow-auto text-sm">{JSON.stringify(data, null, 2)}</pre>
		</div>

		<!-- Client Cookies -->
		<div class="rounded-lg bg-white/5 p-6">
			<h2 class="mb-4 text-xl font-semibold text-yellow-400">Client Cookies</h2>
			<pre class="overflow-auto text-sm">{JSON.stringify(clientCookies, null, 2)}</pre>
		</div>

		<!-- Page Data -->
		<div class="rounded-lg bg-white/5 p-6">
			<h2 class="mb-4 text-xl font-semibold text-purple-400">Page Info</h2>
			<pre class="overflow-auto text-sm">{JSON.stringify(
					{
						url: $page.url.href,
						pathname: $page.url.pathname,
						search: $page.url.search
					},
					null,
					2
				)}</pre>
		</div>
	</div>

	<div class="mt-8 flex flex-wrap gap-4">
		<a href="/login" class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
			Go to Login
		</a>
		<a href="/dashboard" class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
			Go to Dashboard
		</a>
		<button
			onclick={() => window.location.reload()}
			class="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
		>
			Refresh Page
		</button>
		<button
			onclick={testLogin}
			class="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
		>
			Test Login API
		</button>
		<button
			onclick={checkAuthState}
			class="rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
		>
			Check Auth
		</button>
	</div>
</div>
