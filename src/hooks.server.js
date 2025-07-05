import { redirect } from '@sveltejs/kit';
import { API_CONFIG } from '$lib/config/api.js';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Пропускаем API routes - они обрабатываются отдельно
	if (event.url.pathname.startsWith('/api/')) {
		return resolve(event);
	}

	// Проверяем наличие необходимых cookies от Laravel Sanctum
	const laravelSession = event.cookies.get('bonus5_session');
	const xsrfToken = event.cookies.get('XSRF-TOKEN');

	// Пользователь считается аутентифицированным если есть обе cookie
	// Более мягкая проверка - достаточно bonus5_development_session
	event.locals.isAuthenticated = !!laravelSession;
	event.locals.authToken = laravelSession;
	event.locals.user = null;

	// Если пользователь аутентифицирован, получаем его данные
	if (laravelSession) {
		try {
			console.log('🔄 Fetching user data from Laravel API...');
			const response = await fetch('http://host.docker.internal:7010/api/user', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Cookie: `bonus5_session=${laravelSession}${xsrfToken ? `; XSRF-TOKEN=${xsrfToken}` : ''}`,
					'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
					Referer: 'http://localhost:5010',
					Origin: 'http://localhost:5010'
				}
			});

			console.log('📡 Laravel user API response:', {
				status: response.status,
				ok: response.ok
			});

			if (response.ok) {
				const userData = await response.json();
				console.log('👤 User data from Laravel:', userData);
				event.locals.user = userData.user || userData;
				event.locals.isAuthenticated = true;
			} else {
				console.log('❌ Laravel user API failed:', response.status);
				// Если получение пользователя не удалось, считаем неаутентифицированным
				event.locals.isAuthenticated = false;
				event.locals.user = null;
			}
		} catch (error) {
			console.error('💥 Error fetching user data in hooks:', error);
			event.locals.isAuthenticated = false;
			event.locals.user = null;
		}
	}

	// Добавляем дополнительную информацию для отладки
	console.log('🔍 Auth check:', {
		path: event.url.pathname,
		laravelSession: laravelSession ? laravelSession.substring(0, 20) + '...' : null,
		xsrfToken: !!xsrfToken,
		isAuthenticated: event.locals.isAuthenticated,
		userEmail: event.locals.user?.email,
		emailVerified: event.locals.user?.email_verified,
		allCookies: Object.keys(
			Object.fromEntries(
				event.cookies.getAll().map((c) => [c.name, c.value.substring(0, 10) + '...'])
			)
		)
	});

	return resolve(event);
}
