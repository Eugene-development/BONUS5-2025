<script>
	import { visibleMobileMenu } from '$lib/state/visibleMobileMenu.svelte';
	import { auth, logout } from '$lib/state/auth.svelte.js';
</script>

{#if visibleMobileMenu.value}
	<!-- Mobile menu, show/hide based on menu open state. -->
	<div class="lg:hidden" role="dialog" aria-modal="true">
		<!-- Background backdrop, show/hide based on slide-over state. -->
		<div class="fixed inset-0 z-10"></div>
		<div
			class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10"
		>
			<div class="flex items-center justify-between">
				<!-- <a href="#" class="-m-1.5 p-1.5">
          <span class="sr-only">Your Company</span>
          <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="">
        </a> -->
				<button
					onclick={() => (visibleMobileMenu.value = false)}
					type="button"
					class="-m-2.5 rounded-md p-2.5 text-gray-400"
				>
					<span class="sr-only">Close menu</span>
					<svg
						class="size-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="mt-6 flow-root">
				<div class="-my-6 divide-y divide-gray-500/25">
					<div class="space-y-2 py-6">
						<!-- <a
							href="/oferta"
							class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-gray-800"
							>Оферта</a
						> -->
						<a
							href="/"
							class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-gray-800"
							>Главная</a
						>
						<a
							href="/project"
							class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-gray-800"
							>Проект</a
						>
						<a
							href="/payments"
							class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-gray-800"
							>Выплаты</a
						>
						<a
							href="/152fz"
							class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-gray-800"
							>152 ФЗ</a
						>
					</div>
					<div class="py-6">
						{#if auth.isAuthenticated}
							<a
								href="/dashboard"
								class="-mx-3 mb-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-gray-800"
							>
								Личный кабинет
							</a>
							<button
								onclick={async () => {
									await logout();
									visibleMobileMenu.value = false;
								}}
								class="-mx-3 block w-full rounded-lg px-3 py-2.5 text-left text-base/7 font-semibold text-white hover:bg-gray-800"
							>
								Выход
							</button>
						{:else}
							<a
								href="/login"
								class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-gray-800"
								>Вход</a
							>
							<a
								href="/registration"
								class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-gray-800"
								>Регистрация</a
							>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
