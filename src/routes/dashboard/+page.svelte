<script>
	import { auth, logout } from '$lib/state/auth.svelte.js';
	import { goto } from '$app/navigation';

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	// Handle logout with redirect
	async function handleLogout() {
		const success = await logout();
		if (success) {
			goto('/');
		}
	}
</script>

<div class="relative isolate bg-gray-900 py-24 sm:py-32">
	<div class="mx-auto max-w-4xl px-6 lg:px-8">
		<!-- Page Header -->
		<div class="mx-auto mb-16 text-center">
			<h1 class="text-4xl font-normal tracking-widest text-white sm:text-6xl">Личный кабинет</h1>
			<p class="mt-6 text-lg/8 text-gray-300">
				{data.message}
			</p>
		</div>

		<!-- User Info Card -->
		<div class="mb-8 rounded-lg bg-white/5 p-8 backdrop-blur-sm">
			<h2 class="mb-6 text-2xl font-semibold tracking-wide text-white">
				Информация о пользователе
			</h2>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-300"> Имя </label>
					<div class="rounded-md bg-white/10 px-4 py-3 text-lg text-white">
						{data.user?.name || 'Не указано'}
					</div>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-gray-300"> Email </label>
					<div class="rounded-md bg-white/10 px-4 py-3 text-lg text-white">
						{data.user?.email || 'Не указано'}
					</div>
				</div>
			</div>
		</div>

		<!-- Dashboard Actions -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<!-- Profile Section -->
			<div class="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
				<div class="mb-4 flex items-center">
					<svg
						class="mr-3 h-8 w-8 text-indigo-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						></path>
					</svg>
					<h3 class="text-xl font-semibold text-white">Профиль</h3>
				</div>
				<p class="mb-4 text-gray-300">Управление личными данными</p>
				<button class="font-medium text-indigo-400 hover:text-indigo-300"> Редактировать → </button>
			</div>

			<!-- Payments Section -->
			<div class="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
				<div class="mb-4 flex items-center">
					<svg
						class="mr-3 h-8 w-8 text-green-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
						></path>
					</svg>
					<h3 class="text-xl font-semibold text-white">Выплаты</h3>
				</div>
				<p class="mb-4 text-gray-300">История доходов и выплат</p>
				<a href="/payments" class="font-medium text-green-400 hover:text-green-300">
					Посмотреть →
				</a>
			</div>

			<!-- Settings Section -->
			<div class="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
				<div class="mb-4 flex items-center">
					<svg
						class="mr-3 h-8 w-8 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						></path>
					</svg>
					<h3 class="text-xl font-semibold text-white">Настройки</h3>
				</div>
				<p class="mb-4 text-gray-300">Конфигурация аккаунта</p>
				<button class="font-medium text-gray-400 hover:text-gray-300"> Настроить → </button>
			</div>
		</div>

		<!-- Quick Stats -->
		<div class="mb-8 rounded-lg bg-white/5 p-8 backdrop-blur-sm">
			<h2 class="mb-6 text-2xl font-semibold tracking-wide text-white">Быстрая статистика</h2>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-indigo-400">0</div>
					<div class="text-gray-300">Активных проектов</div>
				</div>

				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-green-400">₽0</div>
					<div class="text-gray-300">Общий доход</div>
				</div>

				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-yellow-400">0</div>
					<div class="text-gray-300">Выплат получено</div>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<a
				href="/project"
				class="rounded-lg bg-indigo-500 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-indigo-600"
			>
				Перейти к проектам
			</a>

			<button
				onclick={handleLogout}
				disabled={auth.loading}
				class="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
			>
				{auth.loading ? 'Выход...' : 'Выйти из аккаунта'}
			</button>
		</div>

		<!-- Security Notice -->
		<div class="mt-8 text-center">
			<p class="text-sm text-gray-400">
				Эта страница доступна только авторизованным пользователям.
				<br />
				Ваша сессия защищена и данные передаются по защищенному соединению.
			</p>
		</div>
	</div>
</div>
