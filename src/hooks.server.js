import { getBackendUrl, getFrontendUrl } from '$lib/utils/backend.js';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	console.log('🔄 Fetching user data from Laravel API...');

	try {
		const backendUrl = getBackendUrl();
		const frontendUrl = getFrontendUrl();

		// Get session cookie
		const sessionCookie = event.cookies.get('bonus5_session');
		const xsrfToken = event.cookies.get('XSRF-TOKEN');

		if (!sessionCookie) {
			console.log('❌ No session cookie found');
			event.locals.user = null;
			event.locals.isAuthenticated = false;
			return await resolve(event);
		}

		// Fetch user data from Laravel
		const response = await fetch(`${backendUrl}/api/user`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-XSRF-TOKEN': xsrfToken || '',
				Referer: frontendUrl,
				Origin: frontendUrl,
				Cookie: `XSRF-TOKEN=${encodeURIComponent(xsrfToken || '')}; bonus5_session=${sessionCookie}`
			},
			credentials: 'include'
		});

		if (response.ok) {
			const userData = await response.json();
			console.log('✅ User authenticated:', userData.user?.email);

			// Set user data in locals
			event.locals.user = userData.user;
			event.locals.isAuthenticated = true;
		} else {
			console.log('❌ User not authenticated:', response.status);
			event.locals.user = null;
			event.locals.isAuthenticated = false;
		}
	} catch (error) {
		console.error('💥 Error fetching user data in hooks:', error);
		event.locals.user = null;
		event.locals.isAuthenticated = false;
	}

	// Debug authentication state
	console.log('🔍 Auth check:', {
		path: event.url.pathname,
		laravelSession: event.cookies.get('bonus5_session')?.substring(0, 20) + '...',
		xsrfToken: !!event.cookies.get('XSRF-TOKEN'),
		isAuthenticated: event.locals.isAuthenticated,
		userEmail: event.locals.user?.email,
		emailVerified: event.locals.user?.email_verified,
		allCookies: event.cookies.getAll().map((c) => c.name)
	});

	return await resolve(event);
}
