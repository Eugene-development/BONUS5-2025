<script>
</script>

<div class="relative isolate bg-gray-900 py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto">
			<h2 class="text-4xl font-semibold tracking-widest text-pretty text-white sm:text-6xl">
				Регистрация
			</h2>
			<p class="mt-6 text-lg/8 text-gray-300">
				Зарегистрируйтесь, чтобы начать зарабатывать с BONUS5
			</p>
		</div>

		<div class="mx-auto mt-16 max-w-xl">
			<form action="#" method="POST" class="space-y-8">
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
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
							/>
						</div>
					</div>
					<div>
						<label for="last-name" class="block text-sm/6 font-semibold text-white"
							>Номер банковской карты</label
						>
						<div class="mt-2.5">
							<input
								type="text"
								name="last-name"
								id="last-name"
								autocomplete="family-name"
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
							/>
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
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
							/>
						</div>
					</div>
					<!-- <div class="sm:col-span-2">
            <label for="phone-number" class="block text-sm/6 font-semibold text-white">Телефон</label>
            <div class="mt-2.5">
              <input type="tel" name="phone-number" id="phone-number" autocomplete="tel" class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500">
            </div>
          </div> -->
					<div class="sm:col-span-2">
						<label for="password" class="block text-sm/6 font-semibold text-white">Пароль</label>
						<div class="mt-2.5">
							<input
								type="password"
								name="password"
								id="password"
								autocomplete="new-password"
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
							/>
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
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
							/>
						</div>
					</div>
					<div class="sm:col-span-2">
						<div class="flex items-center gap-x-3">
							<input
								id="terms"
								name="terms"
								type="checkbox"
								class="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
							/>
							<label for="terms" class="text-sm/6 text-white"
								>Я согласен с <a
									href="/oferta"
									class="font-semibold text-indigo-400 hover:text-indigo-300">условиями оферты</a
								>
								и
								<a href="/152fz" class="font-semibold text-indigo-400 hover:text-indigo-300"
									>политикой обработки персональных данных</a
								></label
							>
						</div>
					</div>
				</div>
				<div class="mt-8 flex justify-end">
					<button
						type="submit"
						class="rounded-md bg-indigo-400 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
						>Зарегистрироваться</button
					>
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
