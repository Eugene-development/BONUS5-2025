<script>
	import '../app.css';
	import { Menu } from './layout/header/UI';
	import { Component } from './layout/footer/UI';
	let { children } = $props();
</script>

<header class="bg-gray-900">
	<Menu />
</header>

{@render children()}

<footer class="border-t border-gray-100 bg-gray-900 py-6">
	<Component />
</footer>
