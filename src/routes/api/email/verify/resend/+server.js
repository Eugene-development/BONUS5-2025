import { json } from '@sveltejs/kit';
import { API_CONFIG } from '$lib/config/api.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	try {
		// Get Laravel session cookie
		const laravelSession = cookies.get('laravel_session');
		const xsrfToken = cookies.get('XSRF-TOKEN');

		if (!laravelSession) {
			return json({ message: 'Не авторизован' }, { status: 401 });
		}

		// Forward request to Laravel API
		const response = await fetch(`${API_CONFIG.baseUrl}/api/email/verify/resend`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Cookie: `laravel_session=${laravelSession}${xsrfToken ? `; XSRF-TOKEN=${xsrfToken}` : ''}`,
				'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
				Referer: API_CONFIG.baseUrl,
				Origin: API_CONFIG.baseUrl
			}
		});

		const data = await response.json();

		if (!response.ok) {
			return json(data, { status: response.status });
		}

		return json(data);
	} catch (error) {
		console.error('Email verification resend proxy error:', error);
		return json({ message: 'Ошибка сервера при повторной отправке письма' }, { status: 500 });
	}
}
