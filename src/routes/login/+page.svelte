<script>
	import { login, auth } from '$lib/state/auth.svelte.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	// Get redirectTo parameter from URL
	let redirectTo = $derived(page.url.searchParams.get('redirectTo') || '/');

	// Form state using Svelte 5 runes
	let formData = $state({
		email: '',
		password: '',
		rememberMe: false
	});

	// Form errors state
	let errors = $state({
		email: '',
		password: '',
		general: ''
	});

	// Loading state
	let isLoading = $state(false);

	/**
	 * Handle form submission
	 * @param {SubmitEvent} event
	 */
	async function handleSubmit(event) {
		event.preventDefault();

		// Reset errors
		errors = {
			email: '',
			password: '',
			general: ''
		};

		// Basic validation
		if (!formData.email) {
			errors.email = 'Email обязателен';
			return;
		}

		if (!formData.password) {
			errors.password = 'Пароль обязателен';
			return;
		}

		isLoading = true;

		try {
			console.log('🚀 Submitting login form...');

			const success = await login(formData.email, formData.password, formData.rememberMe);

			if (success) {
				console.log('✅ Login successful, redirecting to:', redirectTo);
				// Redirect to the original destination or dashboard
				goto(redirectTo);
			} else {
				console.log('❌ Login failed:', auth.error);
				errors.general = auth.error || 'Ошибка авторизации';
			}
		} catch (error) {
			console.error('💥 Login error:', error);
			errors.general = 'Произошла ошибка при входе';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="relative isolate min-h-screen bg-gray-900 py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto text-center">
			<h2 class="text-pretty text-4xl font-normal tracking-widest text-white sm:text-6xl">Вход</h2>
			<!-- <p class="mt-6 text-lg/8 text-gray-300">Войдите в свой аккаунт BONUS5</p> -->
		</div>

		<div class="mx-auto mt-16 max-w-xl">
			{#if errors.general}
				<div class="mb-6 rounded-md bg-red-500/10 p-4 text-red-400">
					{errors.general}
				</div>
			{/if}

			<form onsubmit={handleSubmit} class="space-y-8">
				<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-1">
					<div class="sm:col-span-1">
						<label for="email" class="block text-sm/6 font-semibold text-white">Email</label>
						<div class="mt-2.5">
							<input
								type="email"
								name="email"
								id="email"
								autocomplete="email"
								bind:value={formData.email}
								disabled={isLoading}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 {errors.email
									? 'outline-red-500'
									: ''}"
							/>
							{#if errors.email}
								<p class="mt-1 text-sm text-red-400">{errors.email}</p>
							{/if}
						</div>
					</div>
					<div class="sm:col-span-1">
						<label for="password" class="block text-sm/6 font-semibold text-white">Пароль</label>
						<div class="mt-2.5">
							<input
								type="password"
								name="password"
								id="password"
								autocomplete="current-password"
								bind:value={formData.password}
								disabled={isLoading}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 {errors.password
									? 'outline-red-500'
									: ''}"
							/>
							{#if errors.password}
								<p class="mt-1 text-sm text-red-400">{errors.password}</p>
							{/if}
						</div>
					</div>
					<div class="sm:col-span-1">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-x-3">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									bind:checked={formData.rememberMe}
									disabled={isLoading}
									class="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900 disabled:opacity-50"
								/>
								<label for="remember-me" class="text-sm/6 text-white">Запомнить меня</label>
							</div>
							<a
								href="/forgot-password"
								class="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
								>Забыли пароль?</a
							>
						</div>
					</div>
				</div>
				<div class="mt-8 flex justify-end">
					<button
						type="submit"
						disabled={isLoading}
						class="rounded-md bg-indigo-400 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-70 disabled:hover:bg-indigo-400"
					>
						{isLoading ? 'Входим...' : 'Войти'}
					</button>
				</div>
			</form>

			<div class="mt-10 text-center">
				<p class="text-sm text-gray-300">
					Нет аккаунта?
					<a href="/registration" class="font-semibold text-indigo-400 hover:text-indigo-300"
						>Зарегистрируйтесь</a
					>
				</p>
			</div>
		</div>
	</div>
</div>
