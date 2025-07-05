import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	/**
	 * Default registration action
	 * @param {import('@sveltejs/kit').RequestEvent} event
	 */
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const firstName = String(formData.get('first-name') || '');
		const city = String(formData.get('city') || '');
		const email = String(formData.get('email') || '');
		const password = String(formData.get('password') || '');
		const passwordConfirm = String(formData.get('password-confirm') || '');
		const termsAccepted = formData.get('terms') === 'on';

		// Basic validation
		if (!firstName) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Имя обязательно'
			});
		}

		if (!city) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Город обязателен'
			});
		}

		if (!email) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Email обязателен'
			});
		}

		if (!password) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Пароль обязателен'
			});
		}

		if (String(password).length < 8) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Пароль должен содержать минимум 8 символов'
			});
		}

		if (!passwordConfirm) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Подтверждение пароля обязательно'
			});
		}

		if (password !== passwordConfirm) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Пароли не совпадают'
			});
		}

		if (!termsAccepted) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Необходимо принять условия'
			});
		}

		try {
			// First get CSRF token
			const csrfResponse = await fetch('http://host.docker.internal:7010/sanctum/csrf-cookie', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Referer: 'http://localhost:5010',
					Origin: 'http://localhost:5010'
				},
				credentials: 'include'
			});

			// Extract CSRF token from response headers and set session cookies
			let csrfToken = '';
			const setCookieHeaders = csrfResponse.headers.getSetCookie();
			setCookieHeaders.forEach((cookieString) => {
				if (cookieString.includes('XSRF-TOKEN=')) {
					const tokenMatch = cookieString.match(/XSRF-TOKEN=([^;]+)/);
					if (tokenMatch) {
						csrfToken = decodeURIComponent(tokenMatch[1]);
					}
				}

				// Also set session cookie from CSRF request
				if (cookieString.includes('bonus5_session=')) {
					const [cookiePart] = cookieString.split(';');
					const [name, value] = cookiePart.split('=');
					if (name && value) {
						cookies.set(name, value, {
							path: '/',
							httpOnly: true,
							secure: false,
							sameSite: 'lax'
						});
					}
				}
			});

			console.log('🔐 Registration: Got CSRF token for registration');

			// Set CSRF token in SvelteKit cookies for frontend access
			if (csrfToken) {
				cookies.set('XSRF-TOKEN', csrfToken, {
					path: '/',
					httpOnly: false,
					secure: false,
					sameSite: 'lax'
				});
			}

			// Direct call to Laravel API (bypass client API to avoid serialization issues)
			const userData = {
				name: firstName, // Laravel expects 'name', not 'firstName'
				city,
				email,
				password,
				password_confirmation: passwordConfirm,
				terms_accepted: termsAccepted
			};

			const response = await fetch('http://host.docker.internal:7010/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
					'X-XSRF-TOKEN': csrfToken,
					Referer: 'http://localhost:5010',
					Origin: 'http://localhost:5010'
				},
				body: JSON.stringify(userData),
				credentials: 'include'
			});

			const result = await response.json();

			if (response.ok) {
				// Set Laravel session cookies
				const responseSetCookieHeaders = response.headers.getSetCookie();
				responseSetCookieHeaders.forEach((cookieString) => {
					const [cookiePart] = cookieString.split(';');
					const [name, value] = cookiePart.split('=');

					if (name && value) {
						console.log(`🍪 Registration: Setting cookie ${name}`);
						cookies.set(name, value, {
							path: '/',
							httpOnly: name === 'bonus5_session',
							secure: false,
							sameSite: 'lax'
						});
					}
				});

				return {
					success: true,
					user: result.user,
					message: result.message
				};
			} else {
				return fail(422, {
					firstName,
					city,
					email,
					error: true,
					message: result.message || 'Ошибка регистрации',
					errors: result.errors
				});
			}
		} catch (error) {
			console.error('Registration error:', error);

			return fail(500, {
				firstName,
				city,
				email,
				error: true,
				message: 'Произошла ошибка при регистрации'
			});
		}
	}
};

/**
 * Helper function to get cookie from request
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {string} name
 */
function getCookie(cookies, name) {
	return cookies.get(name);
}
