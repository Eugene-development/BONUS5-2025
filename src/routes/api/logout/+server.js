import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, fetch }) {
	try {
		// First, try to get a fresh CSRF token if needed
		let csrfToken = cookies.get('XSRF-TOKEN') || '';

		console.log('🔓 Starting logout process', {
			hasCsrfToken: !!csrfToken,
			hasSession: !!cookies.get('bonus5_session')
		});

		// Try logout with current token first
		let response = await fetch('http://host.docker.internal:7010/api/logout', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-XSRF-TOKEN': csrfToken,
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

		console.log('🔄 Logout API response', {
			status: response.status,
			ok: response.ok
		});

		// If CSRF token mismatch, try to get a fresh token and retry
		if (response.status === 419) {
			console.log('🔄 CSRF token mismatch, getting fresh token...');

			// Get fresh CSRF token
			await fetch('http://host.docker.internal:7010/sanctum/csrf-cookie', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Referer: 'http://localhost:5010',
					Origin: 'http://localhost:5010',
					Cookie: cookies
						.getAll()
						.map((cookie) => `${cookie.name}=${cookie.value}`)
						.join('; ')
				},
				credentials: 'include'
			});

			// Get updated CSRF token from cookies
			csrfToken = cookies.get('XSRF-TOKEN') || '';

			console.log('🔄 Retrying logout with fresh token...');

			// Retry logout with fresh token
			response = await fetch('http://host.docker.internal:7010/api/logout', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
					'X-XSRF-TOKEN': csrfToken,
					Referer: 'http://localhost:5010',
					Origin: 'http://localhost:5010',
					Cookie: cookies
						.getAll()
						.map((cookie) => `${cookie.name}=${cookie.value}`)
						.join('; ')
				},
				credentials: 'include'
			});
		}

		// Always clear cookies regardless of API response
		console.log('🧹 Clearing cookies...');
		cookies.delete('bonus5_session', { path: '/' });
		cookies.delete('XSRF-TOKEN', { path: '/' });

		console.log('✅ Logout completed', {
			finalStatus: response.status,
			cookiesCleared: true
		});

		// Try to parse response, but don't fail if it's not JSON
		let data;
		try {
			data = await response.json();
		} catch {
			data = { success: true, message: 'Вы вышли из системы' };
		}

		// Return success even if API call failed, since we cleared local state
		return json(response.ok ? data : { success: true, message: 'Вы вышли из системы' }, {
			status: 200
		});
	} catch (error) {
		console.error('💥 Logout error:', error);

		// Always clear cookies even on error
		console.log('🧹 Force clearing cookies after error...');
		cookies.delete('bonus5_session', { path: '/' });
		cookies.delete('XSRF-TOKEN', { path: '/' });

		// Return success since we cleared local state
		return json({ success: true, message: 'Вы вышли из системы' }, { status: 200 });
	}
}
