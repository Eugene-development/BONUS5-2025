import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
	// Проверяем аутентификацию на сервере
	if (!locals.isAuthenticated) {
		// Редирект на login с возвратным URL
		const redirectTo = url.pathname + url.search;
		redirect(307, `/login?redirectTo=${encodeURIComponent(redirectTo)}`);
	}

	// Если пользователь авторизован, возвращаем данные
	return {
		message: 'Добро пожаловать в личный кабинет!'
	};
}
