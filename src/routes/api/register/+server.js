import { json } from '@sveltejs/kit';
import { API_CONFIG } from '$lib/config/api.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	try {
		// Get request body
		const userData = await request.json();

		// Get Laravel session cookie and CSRF token
		const xsrfToken = cookies.get('XSRF-TOKEN');

		// Forward request to Laravel API
		const response = await fetch(`http://localhost:7010/api/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
				Referer: 'http://localhost:5010',
				Origin: 'http://localhost:5010'
			},
			body: JSON.stringify(userData),
			credentials: 'include'
		});

		const data = await response.json();

		// Forward Laravel response including status code
		if (!response.ok) {
			return json(data, { status: response.status });
		}

		// Set cookies from Laravel response
		const setCookieHeaders = response.headers.getSetCookie();
		setCookieHeaders.forEach((cookieString) => {
			const [cookiePart] = cookieString.split(';');
			const [name, value] = cookiePart.split('=');

			if (name && value) {
				cookies.set(name, value, {
					path: '/',
					httpOnly: false, // Allow JavaScript access for SPA authentication
					secure: false, // Set to true in production with HTTPS
					sameSite: 'lax'
				});
			}
		});

		return json(data);
	} catch (error) {
		console.error('Registration proxy error:', error);
		return json({ message: 'Ошибка сервера при регистрации' }, { status: 500 });
	}
}
