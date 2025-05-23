<script>
</script>

<div class="relative isolate bg-gray-900 py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto">
			<h2 class="text-4xl font-semibold tracking-widest text-pretty text-white sm:text-6xl">
				Вход
			</h2>
			<p class="mt-6 text-lg/8 text-gray-300">Войдите в свой аккаунт BONUS5</p>
		</div>

		<div class="mx-auto mt-16 max-w-xl">
			<form action="#" method="POST" class="space-y-8">
				<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-1">
					<div class="sm:col-span-1">
						<label for="email" class="block text-sm/6 font-semibold text-white">Email</label>
						<div class="mt-2.5">
							<input
								type="email"
								name="email"
								id="email"
								autocomplete="email"
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
							/>
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
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
							/>
						</div>
					</div>
					<div class="sm:col-span-1">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-x-3">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
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
						class="rounded-md bg-indigo-400 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
						>Войти</button
					>
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
