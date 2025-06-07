import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Проверяем наличие необходимых cookies от Laravel Sanctum
	const laravelSession = event.cookies.get('laravel_session');
	const xsrfToken = event.cookies.get('XSRF-TOKEN');

	// Пользователь считается аутентифицированным если есть обе cookie
	// Более мягкая проверка - достаточно laravel_session
	event.locals.isAuthenticated = !!laravelSession;
	event.locals.authToken = laravelSession;

	// Добавляем дополнительную информацию для отладки
	console.log('🔍 Auth check:', {
		path: event.url.pathname,
		laravelSession: !!laravelSession,
		xsrfToken: !!xsrfToken,
		isAuthenticated: event.locals.isAuthenticated
	});

	return resolve(event);
}
