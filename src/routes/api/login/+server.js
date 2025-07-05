import { json } from '@sveltejs/kit';
import { getBackendUrl, getFrontendUrl } from '$lib/utils/backend.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, fetch }) {
	try {
		// Get fresh CSRF token first
		const backendUrl = getBackendUrl();
		const frontendUrl = getFrontendUrl();

		console.log('🔐 Getting fresh CSRF token before login...');

		const csrfResponse = await fetch(`${backendUrl}/sanctum/csrf-cookie`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Referer: frontendUrl,
				Origin: frontendUrl
			},
			credentials: 'include'
		});

		// Extract and set cookies from CSRF response
		let csrfToken = '';
		let sessionCookie = '';

		const setCookieHeaders = csrfResponse.headers.getSetCookie();
		setCookieHeaders.forEach((cookieString) => {
			console.log('🍪 Processing cookie from CSRF request:', cookieString.substring(0, 50) + '...');

			// Parse cookie
			const [cookiePart] = cookieString.split(';');
			const [name, value] = cookiePart.split('=');

			if (name && value) {
				if (name === 'XSRF-TOKEN') {
					csrfToken = decodeURIComponent(value);
					cookies.set(name, value, {
						path: '/',
						httpOnly: false,
						secure: false,
						sameSite: 'lax'
					});
				} else if (name === 'bonus5_session') {
					sessionCookie = value;
					cookies.set(name, value, {
						path: '/',
						httpOnly: true,
						secure: false,
						sameSite: 'lax',
						maxAge: 7200
					});
				}
			}
		});

		const { email, password, remember } = await request.json();

		// Make login request with fresh tokens
		const response = await fetch(`${backendUrl}/api/login`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-XSRF-TOKEN': csrfToken,
				Referer: frontendUrl,
				Origin: frontendUrl,
				// Include fresh cookies
				Cookie: `XSRF-TOKEN=${encodeURIComponent(csrfToken)}; bonus5_session=${sessionCookie}`
			},
			credentials: 'include',
			body: JSON.stringify({ email, password, remember })
		});

		// Handle Laravel response cookies
		const responseCookieHeaders = response.headers.getSetCookie();
		responseCookieHeaders.forEach((cookieString) => {
			console.log('🍪 Processing cookie:', cookieString.substring(0, 50) + '...');

			// Parse cookie
			const [cookiePart] = cookieString.split(';');
			const [name, value] = cookiePart.split('=');

			if (name && value) {
				const isSessionCookie = name === 'bonus5_session';
				const isXsrfToken = name === 'XSRF-TOKEN';

				if (isSessionCookie || isXsrfToken) {
					console.log(`🍪 Setting cookie ${name}:`, isSessionCookie ? 'session' : 'xsrf');

					cookies.set(name, value, {
						path: '/',
						httpOnly: isSessionCookie,
						secure: false,
						sameSite: 'lax',
						maxAge: isSessionCookie ? 7200 : undefined // 2 hours for session
					});
				}
			}
		});

		const data = await response.json();

		return json(data, { status: response.status });
	} catch (error) {
		console.error('💥 Login proxy error:', error);
		return json(
			{
				success: false,
				message: 'Произошла ошибка при входе',
				errors: {}
			},
			{ status: 500 }
		);
	}
}
