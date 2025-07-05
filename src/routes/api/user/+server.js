import { json } from '@sveltejs/kit';
import { getBackendUrl, getFrontendUrl } from '$lib/utils/backend.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, fetch }) {
	try {
		const backendUrl = getBackendUrl();
		const frontendUrl = getFrontendUrl();

		const response = await fetch(`${backendUrl}/api/user`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-XSRF-TOKEN': cookies.get('XSRF-TOKEN') || '',
				Referer: frontendUrl,
				Origin: frontendUrl,
				Cookie: cookies
					.getAll()
					.map((cookie) => `${cookie.name}=${cookie.value}`)
					.join('; ')
			},
			credentials: 'include'
		});

		const data = await response.json();
		return json(data, { status: response.status });
	} catch (error) {
		console.error('User API proxy error:', error);
		return json(
			{ success: false, message: 'Ошибка получения данных пользователя' },
			{ status: 500 }
		);
	}
}
