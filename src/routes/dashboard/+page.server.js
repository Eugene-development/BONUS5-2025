import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
	// Проверяем аутентификацию на сервере
	if (!locals.isAuthenticated) {
		// Редирект на login с возвратным URL
		const redirectTo = url.pathname + url.search;
		redirect(307, `/login?redirectTo=${encodeURIComponent(redirectTo)}`);
	}

	// Проверяем верификацию email
	if (locals.user && !locals.user.email_verified) {
		// Редирект на страницу верификации email
		redirect(307, '/email-verify');
	}

	// Если пользователь авторизован и email подтвержден, возвращаем данные
	return {
		message: 'Добро пожаловать в личный кабинет!'
	};
}
