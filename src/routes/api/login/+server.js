import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, fetch }) {
	try {
		const body = await request.json();

		// Получаем CSRF токен от Laravel Sanctum
		const csrfResponse = await fetch('http://localhost:8000/sanctum/csrf-cookie', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Referer: 'http://localhost:5173',
				Origin: 'http://localhost:5173'
			},
			credentials: 'include'
		});

		// Извлекаем CSRF cookie из ответа
		let xsrfToken = '';
		let sessionCookie = '';
		const csrfSetCookieHeaders = csrfResponse.headers.getSetCookie();

		csrfSetCookieHeaders.forEach((cookieString) => {
			const [cookiePart] = cookieString.split(';');
			const [name, value] = cookiePart.split('=');

			if (name === 'XSRF-TOKEN') {
				// Токен уже URL encoded, берем как есть для заголовка, и декодируем для cookie
				xsrfToken = decodeURIComponent(value);
				cookies.set('XSRF-TOKEN', value, {
					path: '/',
					httpOnly: false,
					secure: false,
					sameSite: 'lax'
				});
			}

			if (name.includes('session')) {
				sessionCookie = `${name}=${value}`;
				cookies.set(name, value, {
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'lax'
				});
			}
		});

		// Forward request to Laravel API с CSRF токеном
		const response = await fetch('http://localhost:8000/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-XSRF-TOKEN': xsrfToken,
				Referer: 'http://localhost:5173',
				Origin: 'http://localhost:5173',
				// Передаем cookies точно как получили
				Cookie: `XSRF-TOKEN=${cookies.get('XSRF-TOKEN') || ''}; ${sessionCookie}`
			},
			body: JSON.stringify(body),
			credentials: 'include'
		});

		const data = await response.json();

		// Extract and set cookies from Laravel response
		const setCookieHeaders = response.headers.getSetCookie();
		setCookieHeaders.forEach((cookieString) => {
			const [cookiePart, ...attributeParts] = cookieString.split(';');
			const [name, value] = cookiePart.split('=');

			// Parse cookie attributes
			/** @type {any} */
			const attributes = {};
			attributeParts.forEach((attr) => {
				const [key, val] = attr.trim().split('=');
				if (key.toLowerCase() === 'path') attributes.path = val || '/';
				if (key.toLowerCase() === 'domain') attributes.domain = val;
				if (key.toLowerCase() === 'httponly') attributes.httpOnly = true;
				if (key.toLowerCase() === 'secure') attributes.secure = true;
				if (key.toLowerCase() === 'samesite') attributes.sameSite = val;
			});

			// Set cookie in SvelteKit
			cookies.set(name, value, {
				path: attributes.path || '/',
				httpOnly: attributes.httpOnly || false,
				secure: attributes.secure || false,
				sameSite: attributes.sameSite || 'lax'
			});
		});

		return json(data, { status: response.status });
	} catch (error) {
		console.error('Login proxy error:', error);
		return json({ success: false, message: 'Произошла ошибка при входе' }, { status: 500 });
	}
}
