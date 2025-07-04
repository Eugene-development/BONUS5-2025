import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, fetch }) {
	try {
		const body = await request.json();

		// Получаем CSRF токен от Laravel Sanctum
		const csrfResponse = await fetch('http://localhost:7010/sanctum/csrf-cookie', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Referer: 'http://localhost:5010',
				Origin: 'http://localhost:5010'
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
					httpOnly: false, // Allow JavaScript access for SPA
					secure: false,
					sameSite: 'lax'
				});
			}
		});

		// Forward request to Laravel API с CSRF токеном
		const response = await fetch('http://localhost:7010/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-XSRF-TOKEN': xsrfToken,
				Referer: 'http://localhost:5010',
				Origin: 'http://localhost:5010',
				// Передаем cookies точно как получили
				Cookie: `XSRF-TOKEN=${cookies.get('XSRF-TOKEN') || ''}; ${sessionCookie}`
			},
			body: JSON.stringify(body),
			credentials: 'include'
		});

		const data = await response.json();
		console.log('🎯 Laravel login response:', {
			status: response.status,
			success: data.success !== false,
			data
		});

		if (!response.ok) {
			console.log('❌ Laravel login failed:', data);
			return json(data, { status: response.status });
		}

		// Extract and set cookies from Laravel response
		const setCookieHeaders = response.headers.getSetCookie();
		console.log('🍪 Setting cookies from Laravel:', setCookieHeaders);

		setCookieHeaders.forEach((cookieString) => {
			const [cookiePart, ...attributeParts] = cookieString.split(';');
			const [name, value] = cookiePart.trim().split('=');

			if (!name || !value) return;

			// Parse cookie attributes
			/** @type {any} */
			const attributes = {
				path: '/',
				httpOnly: false,
				secure: false,
				sameSite: 'lax'
			};

			attributeParts.forEach((attr) => {
				const trimmedAttr = attr.trim();
				if (trimmedAttr.toLowerCase() === 'httponly') attributes.httpOnly = true;
				if (trimmedAttr.toLowerCase() === 'secure') attributes.secure = true;
				if (trimmedAttr.toLowerCase().startsWith('path=')) {
					attributes.path = trimmedAttr.split('=')[1] || '/';
				}
				if (trimmedAttr.toLowerCase().startsWith('samesite=')) {
					attributes.sameSite = trimmedAttr.split('=')[1] || 'lax';
				}
			});

			// Ensure session cookies are accessible for SPA authentication
			if (name.includes('session') || name === 'laravel_session') {
				attributes.httpOnly = false; // Allow JavaScript access for SPA
			}

			console.log(`🍪 Setting cookie ${name}:`, {
				value: value.substring(0, 20) + '...',
				attributes
			});

			// Set cookie in SvelteKit
			cookies.set(name, value, attributes);
		});

		return json(data, { status: response.status });
	} catch (error) {
		console.error('Login proxy error:', error);
		return json({ success: false, message: 'Произошла ошибка при входе' }, { status: 500 });
	}
}
