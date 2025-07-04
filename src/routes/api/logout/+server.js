import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, fetch }) {
	try {
		// Forward request to Laravel API
		const response = await fetch('http://localhost:7010/api/logout', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-XSRF-TOKEN': cookies.get('XSRF-TOKEN') || '',
				Referer: 'http://localhost:5010',
				Origin: 'http://localhost:5010',
				// Forward existing cookies
				Cookie: cookies
					.getAll()
					.map((cookie) => `${cookie.name}=${cookie.value}`)
					.join('; ')
			},
			credentials: 'include'
		});

		// Очищаем cookies при выходе
		cookies.delete('laravel_session', { path: '/' });
		cookies.delete('XSRF-TOKEN', { path: '/' });

		const data = await response.json();
		return json(data, { status: response.status });
	} catch (error) {
		console.error('Logout proxy error:', error);
		return json({ success: false, message: 'Ошибка при выходе' }, { status: 500 });
	}
}
