import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, fetch }) {
	try {
		// Forward request to Laravel API
		const response = await fetch('http://localhost:7010/api/user', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
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

		if (!response.ok) {
			return json(
				{ success: false, message: 'Ошибка аутентификации' },
				{ status: response.status }
			);
		}

		const data = await response.json();
		return json(data);
	} catch (error) {
		console.error('User proxy error:', error);
		return json(
			{ success: false, message: 'Ошибка при получении данных пользователя' },
			{ status: 500 }
		);
	}
}
