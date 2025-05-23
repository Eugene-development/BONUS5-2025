<script>
	import '../app.css';
	import { Menu } from './layout/header/UI';
	let { children } = $props();
	const currentYear = new Date().getFullYear();
</script>

<header class="bg-gray-900">
	<Menu />
</header>

{@render children()}

<footer class="border-t border-gray-100 bg-gray-900 py-6">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="flex items-center justify-between">
			<div>
				<p class="m-0 text-sm text-gray-400">© {currentYear} BONUS5. Все права защищены.</p>
			</div>
			<div>
				<a
					href="mailto:privacy@bonus5.ru"
					class="text-sm font-semibold text-gray-400 hover:text-white">privacy@bonus5.ru</a
				>
			</div>
		</div>
	</div>
</footer>
