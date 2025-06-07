<script>
	import { visibleMobileMenu } from '$lib/state/visibleMobileMenu.svelte';
	import { auth, logout } from '$lib/state/auth.svelte.js';
	import MobileMenu from './MobileMenu/index.svelte';
</script>

<nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
	<!-- <div class="flex lg:flex-1">
      <a href="#" class="-m-1.5 p-1.5">
        <span class="sr-only">Your Company</span>
        <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="">
      </a>
    </div> -->
	<div class="flex lg:hidden">
		<button
			onclick={() => (visibleMobileMenu.value = true)}
			type="button"
			class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
		>
			<span class="sr-only">Open main menu</span>
			<svg
				class="size-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				aria-hidden="true"
				data-slot="icon"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
		</button>
	</div>
	<div class="hidden *:tracking-widest lg:flex lg:gap-x-12">
		<a href="/" class="text-sm/6 font-normal text-white">Главная</a>
		<a href="/oferta" class="text-sm/6 font-normal text-white">Оферта</a>
		<a href="/project" class="text-sm/6 font-normal text-white">Проект</a>
		<a href="/payments" class="text-sm/6 font-normal text-white">Выплаты</a>
		<a href="/152fz" class="text-sm/6 font-normal text-white">152 ФЗ</a>
	</div>
	<div class="hidden *:tracking-widest lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
		{#if auth.isAuthenticated}
			<a href="/dashboard" class="mr-4 text-sm/6 font-normal text-white">Личный кабинет</a>
			<button
				onclick={logout}
				class="text-sm/6 font-normal text-white transition-colors hover:text-gray-300"
			>
				Выход
			</button>
		{:else}
			<a href="/login" class="mr-4 text-sm/6 font-normal text-white">Вход</a>
			<a href="/registration" class="text-sm/6 font-normal text-white">Регистрация</a>
		{/if}
	</div>
</nav>

<MobileMenu />
