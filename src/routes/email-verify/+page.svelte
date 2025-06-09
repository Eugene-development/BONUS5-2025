<script>
	import { auth, sendEmailVerification, resendEmailVerification } from '$lib/state/auth.svelte.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getLaravelSession, getCsrfToken } from '$lib/config/api.js';

	let cooldownTime = $state(0);
	let isResending = $state(false);
	let verificationProgress = $state(0);
	let showSuccess = $state(false);
	let showError = $state(false);
	let errorMessage = $state('');

	// Redirect if already verified
	$effect(() => {
		if (auth.emailVerified) {
			goto('/dashboard');
		}
	});

	// Cooldown timer for resend button
	function startCooldown() {
		cooldownTime = 60;
		const timer = setInterval(() => {
			cooldownTime--;
			if (cooldownTime <= 0) {
				clearInterval(timer);
			}
		}, 1000);
	}

	// Handle resend email
	async function handleResendEmail() {
		if (cooldownTime > 0 || isResending) return;

		console.log('📧 Starting resend email process...');
		isResending = true;
		const success = await resendEmailVerification();

		if (success) {
			console.log('✅ Resend email successful');
			startCooldown();
			// Show success notification
			showSuccess = true;
			setTimeout(() => (showSuccess = false), 3000);
		} else {
			console.error('❌ Resend email failed');
			showError = true;
			errorMessage = 'Не удалось переотправить письмо. Попробуйте еще раз.';
			setTimeout(() => (showError = false), 3000);
		}

		isResending = false;
	}

	// Open email client
	function openEmailClient() {
		const email = auth.user?.email;
		if (email) {
			const domain = email.split('@')[1];
			let mailUrl = 'mailto:';

			// Popular email providers
			if (domain.includes('gmail')) {
				mailUrl = 'https://mail.google.com';
			} else if (domain.includes('outlook') || domain.includes('hotmail')) {
				mailUrl = 'https://outlook.live.com';
			} else if (domain.includes('yahoo')) {
				mailUrl = 'https://mail.yahoo.com';
			}

			window.open(mailUrl, '_blank');
		}
	}

	// Start initial cooldown
	onMount(() => {
		// Check authentication and cookies
		const sessionCookie = getLaravelSession();
		const csrfToken = getCsrfToken();

		console.log('📄 Email-verify page loaded');
		console.log('🔐 Auth state:', auth.isAuthenticated);
		console.log('👤 User:', auth.user);
		console.log('🍪 Laravel session:', sessionCookie);
		console.log('🔑 CSRF token:', csrfToken);

		// If not authenticated or no session cookie, redirect to login
		if (!auth.isAuthenticated || !sessionCookie) {
			console.warn('⚠️ No authentication or session found, redirecting to login');
			showError = true;
			errorMessage = 'Сессия истекла. Пожалуйста, войдите в систему заново.';
			setTimeout(() => {
				goto('/login');
			}, 3000);
			return;
		}

		startCooldown();

		// Check for error messages from URL
		const urlParams = new URLSearchParams($page.url.search);
		const error = urlParams.get('error');

		if (error === 'invalid_link') {
			showError = true;
			errorMessage = 'Недействительная ссылка для подтверждения. Попробуйте переотправить письмо.';
		} else if (error === 'verification_failed') {
			showError = true;
			errorMessage = 'Произошла ошибка при подтверждении email. Попробуйте еще раз.';
		}

		// Simulate verification progress
		const progressTimer = setInterval(() => {
			if (verificationProgress < 100) {
				verificationProgress += 2;
			} else {
				clearInterval(progressTimer);
			}
		}, 100);
	});
</script>

<svelte:head>
	<title>Подтверждение Email - Bonus5</title>
</svelte:head>

<!-- Success Notification -->
{#if showSuccess}
	<div class="notification-container fixed right-4 top-4 z-50">
		<div
			class="notification glass-card slide-in min-w-80 transform p-4 transition-all duration-300"
		>
			<div class="flex items-start space-x-3">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
						<span class="text-lg">📨</span>
					</div>
				</div>
				<div class="min-w-0 flex-1">
					<h4 class="text-sm font-medium leading-tight text-white">Письмо отправлено</h4>
					<p class="mt-1 text-sm leading-relaxed text-gray-300">
						Новое письмо с подтверждением отправлено на вашу почту
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Error Notification -->
{#if showError}
	<div class="notification-container fixed right-4 top-4 z-50">
		<div
			class="notification glass-card slide-in min-w-80 transform border border-red-500/30 bg-red-500/20 p-4 transition-all duration-300"
		>
			<div class="flex items-start space-x-3">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
						<span class="text-lg">⚠️</span>
					</div>
				</div>
				<div class="min-w-0 flex-1">
					<h4 class="text-sm font-medium leading-tight text-white">Ошибка подтверждения</h4>
					<p class="mt-1 text-sm leading-relaxed text-red-300">
						{errorMessage}
					</p>
				</div>
				<button class="ml-2 text-red-400 hover:text-red-300" onclick={() => (showError = false)}>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Main Content -->
<div class="flex min-h-screen items-center justify-center bg-gray-900 px-6">
	<div class="w-full max-w-md">
		<!-- Animated Email Icon -->
		<div class="mb-8 text-center">
			<div
				class="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/20"
			>
				<svg
					class="h-12 w-12 animate-pulse text-blue-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					></path>
					{#if verificationProgress > 50}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4"
							class="text-green-400"
						></path>
					{/if}
				</svg>
			</div>

			<h1 class="verify-headline mb-4 text-3xl font-bold tracking-wide text-white">
				Проверьте вашу почту
			</h1>

			<p class="verify-subheadline text-lg leading-relaxed text-gray-300">
				Мы отправили письмо с подтверждением на<br />
				<span class="font-medium text-blue-400">{auth.user?.email || 'вашу почту'}</span>
			</p>
		</div>

		<!-- Progress Indicator -->
		<div class="glass-card mb-6 p-6">
			<div class="flex items-center space-x-4">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
						<svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							></path>
						</svg>
					</div>
				</div>
				<div class="flex-1">
					<h3 class="mb-1 font-medium text-white">Email отправлен</h3>
					<p class="text-sm text-gray-400">Проверьте папку "Входящие" и "Спам"</p>

					<!-- Progress Bar -->
					<div class="mt-3 h-1 overflow-hidden rounded-full bg-gray-700">
						<div
							class="h-full bg-blue-400 transition-all duration-1000 ease-out"
							style="width: {verificationProgress}%"
						></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="space-y-4">
			<!-- <button
				class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
				onclick={openEmailClient}
			>
				Открыть почтовый клиент
			</button> -->

			<button
				class="w-full rounded-lg bg-white/10 px-4 py-3 font-medium text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
				onclick={handleResendEmail}
				disabled={cooldownTime > 0 || isResending}
			>
				{#if isResending}
					Отправляем...
				{:else if cooldownTime > 0}
					Переотправить письмо
					<span class="block text-sm text-gray-400">Доступно через {cooldownTime}с</span>
				{:else}
					Переотправить письмо
				{/if}
			</button>
		</div>

		<!-- Help Section -->
		<div class="mt-8 text-center">
			<p class="mb-4 text-sm text-gray-400">Не получили письмо?</p>
			<div class="space-y-2 text-sm">
				<a href="#" class="block text-blue-400 transition-colors hover:text-blue-300">
					📥 Проверить папку "Спам"
				</a>
				<a href="/dashboard" class="block text-blue-400 transition-colors hover:text-blue-300">
					🏠 Вернуться в личный кабинет
				</a>
				<a
					href="mailto:support@bonus5.com"
					class="block text-blue-400 transition-colors hover:text-blue-300"
				>
					💬 Связаться с поддержкой
				</a>
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

	.verify-headline {
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
		letter-spacing: -0.025em;
	}

	.verify-subheadline {
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
		line-height: 1.6;
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
