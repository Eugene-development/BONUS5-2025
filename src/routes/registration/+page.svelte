<script>
	import { register, auth } from '$lib/state/auth.svelte.js';
	import { goto } from '$app/navigation';

	// Form state using Svelte 5 runes
	let formData = $state({
		firstName: '',
		city: '',
		email: '',
		password: '',
		passwordConfirm: '',
		termsAccepted: false
	});

	// Form errors state
	let errors = $state({
		firstName: '',
		city: '',
		email: '',
		password: '',
		passwordConfirm: '',
		terms: '',
		general: ''
	});

	// Handle form submission
	async function handleSubmit() {
		// Reset errors
		errors = {
			firstName: '',
			city: '',
			email: '',
			password: '',
			passwordConfirm: '',
			terms: '',
			general: ''
		};

		// Basic validation
		if (!formData.firstName) {
			errors.firstName = 'Имя обязательно';
			return;
		}

		if (!formData.city) {
			errors.city = 'Город обязателен';
			return;
		}

		if (!formData.email) {
			errors.email = 'Email обязателен';
			return;
		}

		if (!formData.password) {
			errors.password = 'Пароль обязателен';
			return;
		}

		if (formData.password.length < 8) {
			errors.password = 'Пароль должен содержать минимум 8 символов';
			return;
		}

		if (!formData.passwordConfirm) {
			errors.passwordConfirm = 'Подтверждение пароля обязательно';
			return;
		}

		if (formData.password !== formData.passwordConfirm) {
			errors.passwordConfirm = 'Пароли не совпадают';
			return;
		}

		if (!formData.termsAccepted) {
			errors.terms = 'Необходимо принять условия';
			return;
		}

		try {
			const success = await register({
				firstName: formData.firstName,
				city: formData.city,
				email: formData.email,
				password: formData.password,
				password_confirmation: formData.passwordConfirm
			});

			if (success) {
				// Redirect to dashboard on successful registration
				goto('/');
			} else {
				errors.general = auth.error || 'Ошибка регистрации';
			}
		} catch (error) {
			errors.general = 'Произошла ошибка при отправке формы';
			console.error('Registration error:', error);
		}
	}
</script>

<div class="relative isolate bg-gray-900 py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto text-center">
			<h2 class="text-4xl font-normal tracking-widest text-pretty text-white sm:text-6xl">
				Регистрация
			</h2>
			<!-- <p class="mt-6 text-lg/8 text-gray-300">
				Зарегистрируйтесь, чтобы начать зарабатывать с BONUS5
			</p> -->
		</div>

		<div class="mx-auto mt-16 max-w-xl">
			{#if errors.general}
				<div class="mb-6 rounded-md bg-red-500/10 p-4 text-red-400">
					{errors.general}
				</div>
			{/if}

			<form on:submit|preventDefault={handleSubmit} class="space-y-8">
				<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
					<div>
						<label for="first-name" class="block text-sm/6 font-semibold text-white">Ваше имя</label
						>
						<div class="mt-2.5">
							<input
								type="text"
								name="first-name"
								id="first-name"
								autocomplete="given-name"
								bind:value={formData.firstName}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 {errors.firstName
									? 'outline-red-500'
									: ''}"
							/>
							{#if errors.firstName}
								<p class="mt-1 text-sm text-red-400">{errors.firstName}</p>
							{/if}
						</div>
					</div>
					<div>
						<label for="city" class="block text-sm/6 font-semibold text-white">Город</label>
						<div class="mt-2.5">
							<input
								type="text"
								name="city"
								id="city"
								autocomplete="address-level2"
								bind:value={formData.city}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 {errors.city
									? 'outline-red-500'
									: ''}"
							/>
							{#if errors.city}
								<p class="mt-1 text-sm text-red-400">{errors.city}</p>
							{/if}
						</div>
					</div>
					<div class="sm:col-span-2">
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
					<div class="sm:col-span-2">
						<label for="password" class="block text-sm/6 font-semibold text-white">Пароль</label>
						<div class="mt-2.5">
							<input
								type="password"
								name="password"
								id="password"
								autocomplete="new-password"
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
					<div class="sm:col-span-2">
						<label for="password-confirm" class="block text-sm/6 font-semibold text-white"
							>Подтверждение пароля</label
						>
						<div class="mt-2.5">
							<input
								type="password"
								name="password-confirm"
								id="password-confirm"
								autocomplete="new-password"
								bind:value={formData.passwordConfirm}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 {errors.passwordConfirm
									? 'outline-red-500'
									: ''}"
							/>
							{#if errors.passwordConfirm}
								<p class="mt-1 text-sm text-red-400">{errors.passwordConfirm}</p>
							{/if}
						</div>
					</div>
					<div class="sm:col-span-2">
						<div class="flex items-center gap-x-3">
							<input
								id="terms"
								name="terms"
								type="checkbox"
								bind:checked={formData.termsAccepted}
								class="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900 {errors.terms
									? 'border-red-500'
									: ''}"
							/>
							<label for="terms" class="text-sm/6 text-white {errors.terms ? 'text-red-400' : ''}">
								Я согласен с <a
									href="/oferta"
									class="font-semibold text-indigo-400 hover:text-indigo-300">условиями оферты</a
								>
								и
								<a href="/152fz" class="font-semibold text-indigo-400 hover:text-indigo-300"
									>политикой обработки персональных данных</a
								>
							</label>
						</div>
						{#if errors.terms}
							<p class="mt-1 text-sm text-red-400">{errors.terms}</p>
						{/if}
					</div>
				</div>
				<div class="mt-8 flex justify-end">
					<button
						type="submit"
						disabled={auth.loading || !formData.termsAccepted}
						class="rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 {formData.termsAccepted &&
						!auth.loading
							? 'bg-indigo-400 hover:bg-pink-400'
							: 'cursor-not-allowed bg-gray-600'}"
					>
						{auth.loading ? 'Регистрация...' : 'Зарегистрироваться'}
					</button>
				</div>
			</form>

			<div class="mt-10 border-t border-white/10 pt-8 text-center">
				<p class="text-sm text-gray-400">
					Уже зарегистрированы? <a
						href="/login"
						class="font-semibold text-indigo-400 hover:text-indigo-300">Войти</a
					>
				</p>
			</div>
		</div>
	</div>
</div>
