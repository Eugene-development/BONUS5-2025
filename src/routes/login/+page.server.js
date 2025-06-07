import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	/**
	 * Default login action
	 * @param {import('@sveltejs/kit').RequestEvent} event
	 */
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const email = String(formData.get('email') || '');
		const password = String(formData.get('password') || '');
		const rememberMe = formData.get('remember-me') === 'on';

		// Basic validation
		if (!email) {
			return fail(400, {
				email,
				rememberMe,
				error: true,
				message: 'Email обязателен'
			});
		}

		if (!password) {
			return fail(400, {
				email,
				rememberMe,
				error: true,
				message: 'Пароль обязателен'
			});
		}

		try {
			// Proxy to Laravel API
			const { loginUser } = await import('$lib/api/auth.js');

			const result = await loginUser(email, password, rememberMe);

			if (result.success) {
				return {
					success: true,
					user: result.user,
					message: result.message
				};
			} else {
				return fail(401, {
					email,
					rememberMe,
					error: true,
					message: result.message || 'Ошибка авторизации'
				});
			}
		} catch (error) {
			console.error('Login error:', error);

			return fail(500, {
				email,
				rememberMe,
				error: true,
				message: 'Произошла ошибка при входе'
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
