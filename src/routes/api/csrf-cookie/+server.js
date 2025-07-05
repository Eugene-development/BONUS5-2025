import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, fetch }) {
	try {
		// Получаем CSRF токен от Laravel Sanctum через внутренний URL
		const response = await fetch('http://host.docker.internal:7010/sanctum/csrf-cookie', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Referer: 'http://localhost:5010',
				Origin: 'http://localhost:5010'
			},
			credentials: 'include'
		});

		if (!response.ok) {
			return json(
				{ success: false, message: 'Не удалось получить CSRF токен' },
				{ status: response.status }
			);
		}

		// Извлекаем и устанавливаем cookies
		const setCookieHeaders = response.headers.getSetCookie();
		setCookieHeaders.forEach((cookieString) => {
			const [cookiePart, ...attributeParts] = cookieString.split(';');
			const [name, value] = cookiePart.split('=');

			if (name === 'XSRF-TOKEN') {
				cookies.set('XSRF-TOKEN', value, {
					path: '/',
					httpOnly: false,
					secure: false,
					sameSite: 'lax'
				});
			}

			if (name.includes('session')) {
				cookies.set(name, value, {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				});
			}
		});

		return json({ success: true, message: 'CSRF токен установлен' });
	} catch (error) {
		console.error('CSRF cookie error:', error);
		return json({ success: false, message: 'Ошибка получения CSRF токена' }, { status: 500 });
	}
}
