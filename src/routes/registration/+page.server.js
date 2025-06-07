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
			// Proxy to Laravel API
			const { registerUser } = await import('$lib/api/auth.js');

			const userData = {
				firstName,
				city,
				email,
				password,
				password_confirmation: passwordConfirm,
				terms_accepted: termsAccepted
			};

			const result = await registerUser(userData);

			if (result.success) {
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
