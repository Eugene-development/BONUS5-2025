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
			// Direct call to Laravel API (bypass client API to avoid serialization issues)
			const userData = {
				name: firstName, // Laravel expects 'name', not 'firstName'
				city,
				email,
				password,
				password_confirmation: passwordConfirm,
				terms_accepted: termsAccepted
			};

			const response = await fetch('http://localhost:8000/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(userData)
			});

			const result = await response.json();

			if (response.ok) {
				// Set Laravel session cookies
				const setCookieHeaders = response.headers.getSetCookie();
				setCookieHeaders.forEach((cookieString) => {
					const [cookiePart] = cookieString.split(';');
					const [name, value] = cookiePart.split('=');

					if (name && value) {
						cookies.set(name, value, {
							path: '/',
							httpOnly: name === 'laravel_session',
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
