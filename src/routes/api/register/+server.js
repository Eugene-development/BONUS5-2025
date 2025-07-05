import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { getBackendUrl, getFrontendUrl } from '$lib/utils/backend.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, fetch }) {
	try {
		const requestData = await request.json();

		console.log('🔍 DETAILED REQUEST DATA ANALYSIS:');
		console.log('📝 Full requestData:', JSON.stringify(requestData, null, 2));
		console.log('📝 Request keys:', Object.keys(requestData));
		console.log('📝 firstName value:', requestData.firstName);
		console.log('📝 firstName type:', typeof requestData.firstName);
		console.log('📝 name value:', requestData.name);
		console.log('📝 name type:', typeof requestData.name);

		// Determine backend and frontend URLs
		const backendUrl = getBackendUrl();
		const frontendUrl = getFrontendUrl();

		console.log('🌐 Backend URL:', backendUrl);
		console.log('🌐 Frontend URL:', frontendUrl);
		console.log('🔧 Environment info:', {
			dev,
			isDev: dev,
			runMode: dev ? 'development' : 'production'
		});

		// First get fresh CSRF token to ensure we have a valid session
		console.log('🔐 Getting fresh CSRF token before registration...');

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

		console.log('🔐 CSRF token extracted:', {
			hasToken: !!csrfToken,
			tokenLength: csrfToken.length,
			hasSession: !!sessionCookie
		});

		// Prepare data for Laravel
		const laravelData = {
			name: requestData.firstName || requestData.name, // Handle both firstName and name fields
			city: requestData.city,
			email: requestData.email,
			password: requestData.password,
			password_confirmation: requestData.password_confirmation,
			terms_accepted: requestData.terms_accepted
		};

		console.log('🔍 LARAVEL DATA PREPARATION:');
		console.log('📝 Laravel data:', JSON.stringify(laravelData, null, 2));
		console.log('📝 Laravel data keys:', Object.keys(laravelData));
		console.log('📝 name value:', laravelData.name);
		console.log('📝 name type:', typeof laravelData.name);
		console.log(
			'📝 name source:',
			requestData.firstName ? 'firstName' : requestData.name ? 'name' : 'missing'
		);

		// Now make registration request with fresh tokens
		const response = await fetch(`${backendUrl}/api/register`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-XSRF-TOKEN': csrfToken,
				Referer: frontendUrl,
				Origin: frontendUrl,
				// Use fresh cookies
				Cookie: `XSRF-TOKEN=${encodeURIComponent(csrfToken)}; bonus5_session=${sessionCookie}`
			},
			credentials: 'include',
			body: JSON.stringify(laravelData)
		});

		console.log('📡 Laravel registration response:', {
			status: response.status,
			ok: response.ok,
			statusText: response.statusText
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

		console.log('🔍 LARAVEL RESPONSE DATA:');
		console.log('📝 Response data:', JSON.stringify(data, null, 2));
		console.log('✅ Registration completed:', {
			success: response.ok,
			status: response.status
		});

		return json(data, { status: response.status });
	} catch (error) {
		console.error('💥 Registration proxy error:', error);
		return json(
			{
				success: false,
				message: 'Произошла ошибка при регистрации',
				errors: {}
			},
			{ status: 500 }
		);
	}
}
