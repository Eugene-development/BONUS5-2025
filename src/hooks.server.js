import { redirect } from '@sveltejs/kit';
import { API_CONFIG } from '$lib/config/api.js';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Проверяем наличие необходимых cookies от Laravel Sanctum
	const laravelSession = event.cookies.get('laravel_session');
	const xsrfToken = event.cookies.get('XSRF-TOKEN');

	// Пользователь считается аутентифицированным если есть обе cookie
	// Более мягкая проверка - достаточно laravel_session
	event.locals.isAuthenticated = !!laravelSession;
	event.locals.authToken = laravelSession;
	event.locals.user = null;

	// Если пользователь аутентифицирован, получаем его данные
	if (laravelSession) {
		try {
			const response = await fetch(`${API_CONFIG.baseUrl}/api/user`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Cookie: `laravel_session=${laravelSession}${xsrfToken ? `; XSRF-TOKEN=${xsrfToken}` : ''}`,
					'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
					Referer: API_CONFIG.baseUrl,
					Origin: API_CONFIG.baseUrl
				}
			});

			if (response.ok) {
				const userData = await response.json();
				event.locals.user = userData.user || userData;
				event.locals.isAuthenticated = true;
			} else {
				// Если получение пользователя не удалось, считаем неаутентифицированным
				event.locals.isAuthenticated = false;
				event.locals.user = null;
			}
		} catch (error) {
			console.error('Error fetching user data in hooks:', error);
			event.locals.isAuthenticated = false;
			event.locals.user = null;
		}
	}

	// Добавляем дополнительную информацию для отладки
	console.log('🔍 Auth check:', {
		path: event.url.pathname,
		laravelSession: !!laravelSession,
		xsrfToken: !!xsrfToken,
		isAuthenticated: event.locals.isAuthenticated,
		userEmail: event.locals.user?.email,
		emailVerified: event.locals.user?.email_verified
	});

	return resolve(event);
}
