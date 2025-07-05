import { json } from '@sveltejs/kit';
import { getBackendUrl, getFrontendUrl } from '$lib/utils/backend.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, fetch }) {
	try {
		const backendUrl = getBackendUrl();
		const frontendUrl = getFrontendUrl();

		console.log('🔓 Starting logout process...');

		// Get current session token for logout
		const xsrfToken = cookies.get('XSRF-TOKEN');
		const sessionCookie = cookies.get('bonus5_session');

		console.log('🍪 Current cookies:', {
			hasXsrfToken: !!xsrfToken,
			hasSession: !!sessionCookie
		});

		// Try logout with current tokens first
		let response = await fetch(`${backendUrl}/api/logout`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-XSRF-TOKEN': xsrfToken || '',
				Referer: frontendUrl,
				Origin: frontendUrl,
				Cookie: `XSRF-TOKEN=${encodeURIComponent(xsrfToken || '')}; bonus5_session=${sessionCookie || ''}`
			},
			credentials: 'include'
		});

		console.log('📡 First logout attempt:', {
			status: response.status,
			ok: response.ok
		});

		// If 419 (CSRF token mismatch), get fresh token and retry
		if (response.status === 419) {
			console.log('🔄 CSRF token mismatch, getting fresh token...');

			// Get fresh CSRF token
			await fetch(`${backendUrl}/sanctum/csrf-cookie`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Referer: frontendUrl,
					Origin: frontendUrl
				},
				credentials: 'include'
			});

			// Get fresh tokens from cookies
			const freshXsrfToken = cookies.get('XSRF-TOKEN');
			const freshSessionCookie = cookies.get('bonus5_session');

			console.log('🍪 Fresh tokens obtained:', {
				hasXsrfToken: !!freshXsrfToken,
				hasSession: !!freshSessionCookie
			});

			// Retry logout with fresh tokens
			response = await fetch(`${backendUrl}/api/logout`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
					'X-XSRF-TOKEN': freshXsrfToken || '',
					Referer: frontendUrl,
					Origin: frontendUrl,
					Cookie: `XSRF-TOKEN=${encodeURIComponent(freshXsrfToken || '')}; bonus5_session=${freshSessionCookie || ''}`
				},
				credentials: 'include'
			});

			console.log('📡 Second logout attempt:', {
				status: response.status,
				ok: response.ok
			});
		}

		// Clear all auth cookies regardless of API response
		console.log('🧹 Clearing authentication cookies...');
		cookies.delete('XSRF-TOKEN', { path: '/' });
		cookies.delete('bonus5_session', { path: '/' });

		// Try to get response data
		let data;
		try {
			data = await response.json();
		} catch {
			data = { message: 'Logout completed' };
		}

		console.log('✅ Logout process completed');

		return json(
			{
				success: true,
				message: 'Вы успешно вышли из системы',
				...data
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('💥 Logout error:', error);

		// Still clear cookies even if logout request failed
		console.log('🧹 Clearing cookies after error...');
		cookies.delete('XSRF-TOKEN', { path: '/' });
		cookies.delete('bonus5_session', { path: '/' });

		return json(
			{
				success: true, // Return success since cookies are cleared
				message: 'Вы вышли из системы'
			},
			{ status: 200 }
		);
	}
}
