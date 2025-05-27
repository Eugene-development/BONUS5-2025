<script>
	import { login, auth } from '$lib/state/auth.svelte.js';
	import { goto } from '$app/navigation';

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

	// Handle form submission
	async function handleSubmit() {
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

		try {
			const success = await login(formData.email, formData.password, formData.rememberMe);

			if (success) {
				// Redirect to dashboard on successful login
				goto('/');
			} else {
				errors.general = auth.error || 'Ошибка авторизации';
			}
		} catch (error) {
			errors.general = 'Произошла ошибка при отправке формы';
			console.error('Login error:', error);
		}
	}
</script>

<div class="relative isolate min-h-screen bg-gray-900 py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto text-center">
			<h2 class="text-4xl font-normal tracking-widest text-pretty text-white sm:text-6xl">Вход</h2>
			<!-- <p class="mt-6 text-lg/8 text-gray-300">Войдите в свой аккаунт BONUS5</p> -->
		</div>

		<div class="mx-auto mt-16 max-w-xl">
			{#if errors.general}
				<div class="mb-6 rounded-md bg-red-500/10 p-4 text-red-400">
					{errors.general}
				</div>
			{/if}

			<form on:submit|preventDefault={handleSubmit} class="space-y-8">
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
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 {errors.email
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
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 {errors.password
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
									class="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
								/>
								<label for="remember-me" class="text-sm/6 text-white">Запомнить меня</label>
							</div>
							<a href="#" class="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
								>Забыли пароль?</a
							>
						</div>
					</div>
				</div>
				<div class="mt-8 flex justify-end">
					<button
						type="submit"
						disabled={auth.loading}
						class="rounded-md bg-indigo-400 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-70 disabled:hover:bg-indigo-400"
					>
						{auth.loading ? 'Входим...' : 'Войти'}
					</button>
				</div>
			</form>

			<div class="mt-10 border-t border-white/10 pt-8 text-center">
				<p class="text-sm text-gray-400">
					Еще нет аккаунта? <a
						href="/registration"
						class="font-semibold text-indigo-400 hover:text-indigo-300">Зарегистрироваться</a
					>
				</p>
			</div>
		</div>
	</div>
</div>
