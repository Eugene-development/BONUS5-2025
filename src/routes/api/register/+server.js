import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, fetch }) {
	try {
		const requestData = await request.json();

		console.log('📝 Registration request received:', {
			email: requestData.email,
			firstName: requestData.firstName,
			city: requestData.city
		});

		// Forward request to Laravel API
		const response = await fetch('http://host.docker.internal:7010/api/register', {
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
			credentials: 'include',
			body: JSON.stringify({
				name: requestData.firstName, // Laravel expects 'name'
				city: requestData.city,
				email: requestData.email,
				password: requestData.password,
				password_confirmation: requestData.password_confirmation,
				terms_accepted: requestData.terms_accepted
			})
		});

		console.log('📡 Laravel registration response:', {
			status: response.status,
			ok: response.ok
		});

		// Handle Laravel response cookies
		const setCookieHeaders = response.headers.getSetCookie();
		setCookieHeaders.forEach((cookieString) => {
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
