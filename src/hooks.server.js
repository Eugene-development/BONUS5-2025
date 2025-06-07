import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Проверяем наличие необходимых cookies от Laravel Sanctum
	const laravelSession = event.cookies.get('laravel_session');
	const xsrfToken = event.cookies.get('XSRF-TOKEN');

	// Пользователь считается аутентифицированным если есть обе cookie
	event.locals.isAuthenticated = !!(laravelSession && xsrfToken);
	event.locals.authToken = laravelSession;

	return resolve(event);
}
