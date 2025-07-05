<script>
	import { register, auth } from '$lib/state/auth.svelte.js';
	import { goto } from '$app/navigation';

	// Import form data from server action
	/** @type {import('./$types').PageProps} */
	let { form } = $props();

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

	// Success notification state
	let showSuccess = $state(false);

	// Watch for form changes (server-side validation)
	$effect(() => {
		if (form?.error) {
			errors.general = form.message;

			// Preserve form values
			if (form.firstName) {
				formData.firstName = String(form.firstName);
			}

			if (form.city) {
				formData.city = String(form.city);
			}

			if (form.email) {
				formData.email = String(form.email);
			}
		}

		// Handle successful authentication
		if (form?.success) {
			// Ensure user object has required properties
			auth.user = {
				id: 1, // Add required id property
				name: String(form.user.name),
				email: String(form.user.email),
				email_verified: false,
				email_verified_at: null
			};
			auth.isAuthenticated = true;

			// Show success notification
			showSuccess = true;

			// Auto-hide notification after 3 seconds
			setTimeout(() => {
				showSuccess = false;
			}, 3000);

			// Small delay to ensure cookies are set, then redirect with registration flag
			setTimeout(() => {
				goto('/email-verify?from_registration=true');
			}, 1500);
		}
	});

	/**
	 * Form submission handler using API instead of form action
	 * @param {SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}} event
	 */
	async function sendFormPrice(event) {
		event.preventDefault();

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

		// Basic validation (client-side)
		if (!formData.firstName) {
			errors.firstName = 'Имя обязательно';
			return false;
		}

		if (!formData.city) {
			errors.city = 'Город обязателен';
			return false;
		}

		if (!formData.email) {
			errors.email = 'Email обязателен';
			return false;
		}

		if (!formData.password) {
			errors.password = 'Пароль обязателен';
			return false;
		}

		if (formData.password.length < 8) {
			errors.password = 'Пароль должен содержать минимум 8 символов';
			return false;
		}

		if (!formData.passwordConfirm) {
			errors.passwordConfirm = 'Подтверждение пароля обязательно';
			return false;
		}

		if (formData.password !== formData.passwordConfirm) {
			errors.passwordConfirm = 'Пароли не совпадают';
			return false;
		}

		if (!formData.termsAccepted) {
			errors.terms = 'Необходимо принять условия';
			return false;
		}

		// Call registration API
		try {
			auth.loading = true;

			console.log('📝 Starting registration...');

			const result = await register({
				firstName: formData.firstName,
				city: formData.city,
				email: formData.email,
				password: formData.password,
				password_confirmation: formData.passwordConfirm,
				terms_accepted: formData.termsAccepted
			});

			if (result) {
				console.log('✅ Registration successful');
				showSuccess = true;

				// Auto-hide notification after 3 seconds
				setTimeout(() => {
					showSuccess = false;
				}, 3000);

				// Redirect to email verification
				setTimeout(() => {
					goto('/email-verify?from_registration=true');
				}, 1500);
			} else {
				console.log('❌ Registration failed');
				errors.general = auth.error || 'Ошибка регистрации';
			}
		} catch (error) {
			console.error('💥 Registration error:', error);
			errors.general = 'Произошла ошибка при регистрации';
		} finally {
			auth.loading = false;
		}

		return true;
	}
</script>

<!-- Success Notification -->
{#if showSuccess}
	<div class="notification-container fixed right-4 top-4 z-50">
		<div
			class="notification glass-card slide-in min-w-80 transform p-4 transition-all duration-300"
		>
			<div class="flex items-start space-x-3">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
						<span class="text-lg">✅</span>
					</div>
				</div>
				<div class="min-w-0 flex-1">
					<h4 class="text-sm font-medium leading-tight text-white">Регистрация прошла успешно</h4>
					<p class="mt-1 text-sm leading-relaxed text-gray-300">
						Подтвердите вашу почту для завершения регистрации
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="relative isolate bg-gray-900 py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto text-center">
			<h2 class="text-pretty text-4xl font-normal tracking-widest text-white sm:text-6xl">
				Регистрация
			</h2>
			<!-- <p class="mt-6 text-lg/8 text-gray-300">
				Зарегистрируйтесь, чтобы начать зарабатывать с BONUS5
			</p> -->
		</div>

		<div class="mx-auto mt-16 max-w-xl">
			{#if errors.general || auth.error}
				<div class="mb-6 rounded-md bg-red-500/10 p-4 text-red-400">
					{errors.general || auth.error}
				</div>
			{/if}

			<form onsubmit={sendFormPrice} class="space-y-8">
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
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 {errors.firstName
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
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 {errors.city
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
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 {errors.email
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
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 {errors.password
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
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 {errors.passwordConfirm
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
						class="rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 {formData.termsAccepted &&
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

<style>
	.glass-card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
	}

	.slide-in {
		animation: slideInFromRight 0.3s ease-out;
	}

	@keyframes slideInFromRight {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.notification-container {
		pointer-events: none;
	}

	.notification {
		pointer-events: auto;
	}
</style>
